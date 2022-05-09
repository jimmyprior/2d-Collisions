
const canvas = document.getElementById("collider");
const ctx = canvas.getContext("2d");


class Rectangle {
  constructor(width, height, xPos, yPos, xVelocity, yVelocity) {
    /*
    */
    this.width = width;
    this.height = height;
    this.xPos = xPos;
    this.yPos = yPos;
    this.xVelocity = xVelocity;
    this.yVelocity = yVelocity;
    this.bounced = false; //prevents objects that just collided from moving and potentially moving into other objects.
  }


  getFuturePosition() {
    //frame? 
    //get the would be future position of the rectangle 
    // returns a list [xpos, ypos]

    let xPos = this.xPos;
    let yPos = this.yPos;

    if (!this.bounced) {
      xPos += this.xVelocity;
      yPos += this.yVelocity;
    }

    return [xPos, yPos];
  }

  handleWallCollide(width, height) {
    let [xPos, yPos] = this.getFuturePosition()

    if (xPos + this.width > width || xPos < 0) {
      //side wall collide
      this.xVelocity *= -1;
      this.bounced = true;
    }
    if (yPos + this.height > height || yPos < 0) {
      //bottom / top collide
      this.yVelocity *= -1;
      this.bounced= true;
    }
  }


  getFutureBorders() {
    //returns top left and bottom right coorindates
    //br = bottom right, tl = top left 
    let [xPos, yPos] = this.getFuturePosition();
    return [xPos, yPos, xPos + this.width, yPos + this.height]
  }


  checkCollission(other) {

    /*
    rectangle : Rectangle
    frame : int

    check if the two rectangles will collide in the next frame
    */

    // If one rectangle is on left side of other

    let [left1, top1, right1, bottom1] = this.getFutureBorders(),
        [left2, top2, right2, bottom2] = other.getFutureBorders();
      // The first rectangle is under the second or vice versa

    if (left1 == right1 || top1 == bottom1 || left2 == right2 || top2 == bottom2) {
      return false;
    }
    //must be seomthing in here
    if (top1 > bottom2 || top2 > bottom1) {
      return false;
    }
    // The first rectangle is to the left of the second or vice versa
    if (right1 < left2 || right2 < left1) {
      return false;
    }
    // Rectangles overlap
    return true;
  }


  update() {
    /*
    only updates if the rectangle did not just bounce
    FUTURE: use get future position instead of having redundant code. how to unpack variables from list javascript..
    */
    let [xPos, yPos] = this.getFuturePosition();
    this.xPos = xPos; 
    this.yPos = yPos;
    this.bounced = false;
  } 

  draw(ctx) {
    /*
    ctx : canvas 2d contect  

    draws the rectangle to the canvas
    */
    
    ctx.fillStyle = 'green';
    ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
  }


  collide(rectangle) {
    //swaps velocties 

    //v1 + v2 = vf1 + vf2  conservation of momentum 
    //v1 + v2 = vf1 + vf2  conservation of velocit

    let xVel = this.xVelocity;
    let yVel = this.yVelocity;

    this.xVelocity = rectangle.xVelocity;
    this.yVelocity = rectangle.yVelocity

    rectangle.xVelocity = xVel;
    rectangle.yVelocity = yVel;

    //prevent them from moving the next frame
    this.bounced = true;
    rectangle.bounced = true;
    
  }

}




//efficient way to handle collissions 


//to start load the image and then do a .then with the setInterval.


class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.rectangles = [
      new Rectangle(200, 100, 1, 1, 20, 2),
      new Rectangle(200, 100, 500, 500, 9, 10), 
      new Rectangle(200, 100, 300, 300, 1, 3), 
      new Rectangle(200, 100, 300, 0, 2, 1)
    ];

  }


  handleCollissions(rectangle) {
    //handles all of the possible collissions for a possible rectangle
    for (let other of this.rectangles) {

      if (Object.is(rectangle, other)) {
        //dont chekc collissions for self
        continue;
      }

      if (rectangle.checkCollission(other)) {
        rectangle.collide(other)
      }
    }
  }


  resize(width, height) {
    this.width = width;
    this.height = height;
  }


  update(ctx) {

    ctx.clearRect(0, 0, this.width, this.height); //wipe it 

    for (let rectangle of this.rectangles) {
      rectangle.handleWallCollide(this.width, this.height)
      this.handleCollissions(rectangle);
    }

    for (let rectangle of this.rectangles) {
      rectangle.update(); //after all bounces have been processed and none will collide, update the ones that should move 
      rectangle.draw(ctx)
    }
  }

}




function run() {
  let width = document.body.clientWidth;
  let height = document.body.clientHeight;

  const game = new Game(width, height);


  function onResize() {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    game.resize(canvas.width, canvas.height)
  }

  function onUpdate() {
    game.update(ctx)
  }

  //event listerns and intervals 
  setInterval(onUpdate, 10);
  onResize();
  window.addEventListener("resize", onResize);

}


//there is still a bug here where the squares will freeze after a long time because two some how end up inside of one another. 
//deubg this issue in the future. Strugglign to figure out what else it could be other than the check collission method. 
//Considering the future positions being checked are the eventual positions. 
run()