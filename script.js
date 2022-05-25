import Rectangle from "./rectangle.js"
/*
REVISED ALGORITHM 

Check to see if a dvd can move with current velocity 
if it can, 
  if it is going to ocllide with a wall. change the velocity and do not move it
  if not, 
    move it immediatetly 

if not, 
  collide it with the other dvd by changing its velocity and the other dvd's velocity 
  (if the other dvd has not been updated it will move in it's new direction assuming no collissions. This is fine)

need to figure out how to handle wall collissions... (update that first probably)

it does not matter if a piece will move. If it has not already, that is where it's being processed. 
*/

class Collider {
  constructor() {
    this.canvas = document.getElementById("collider");
    this.ctx = this.canvas.getContext("2d");

    this.size = {
      width : null,
      height : null
    }

    this.onResize();

    //event listeners 

    window.addEventListener("resize", this.onResize.bind(this));
    this.canvas.addEventListener("click", this.onClick.bind(this));

    this.rectangles = [];

    this.run();

  }


  handleCollissions(rectangle) {
    /*
    rectange : Rectangle

    check if the dvd is going to collide with any other dvds 
    if it will, collide it and change the velocities

    returns -> boolean 
    (true is it collides, false if it did not )
    */

    let collided = false;
    for (let other of this.rectangles) {

      if (Object.is(rectangle, other)) {
        //dont chekc collissions for self
        continue;
      }

      if (rectangle.checkCollission(other)) {
        rectangle.collide(other);
        collided = true;
      }
    }
    return collided;
  }


  
  onUpdate() {
    //update the positions of the rectangles 
    this.ctx.clearRect(0, 0, this.size.width, this.size.height); //wipe it 

    for (let rectangle of this.rectangles) {
      if (this.handleCollissions(rectangle)) {
        //if collided, do not update position
        continue;
      }

      if (rectangle.handleWallCollide(this.size)) {
        //if it hit a wall, do not update position
        continue;
      }
      
      rectangle.update();
    }

    for (let rectangle of this.rectangles) {
      rectangle.draw(this.ctx);
    }
  }

  onResize() {
    //resize the canvas and set the new size 
    this.size = {
      width : document.body.clientWidth,
      height: document.body.clientHeight
    }
    this.canvas.width = this.size.width
    this.canvas.height = this.size.height

  }


  onClick(event) {
    //https://stackoverflow.com/a/18053642
    const rect = this.canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    this.rectangles.push(new Rectangle(200, 100, x, y, Math.round(Math.random() * 10), Math.round(Math.random() * 10)) )
  }


  run() {
    return setInterval(this.onUpdate.bind(this), 10);
  }

}

const game = new Collider();