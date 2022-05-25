class Rectangle {
    constructor(width, height, xPos, yPos, xVelocity, yVelocity) {
        /*
        width : number
        height : number
        xPos : number
        yPos : number
        xVelocity : number
        yVelocity : number
        */
        this.size = {
            width: width,
            height: height
        }

        this.position = {
            x: xPos,
            y: yPos
        }

        this.velocity = {
            x: xVelocity,
            y: yVelocity
        }
    }


    getFuturePosition() {
        /*
        get the future position of the piece
    
        returns ->
        {
            x : number, (future position)
            y : number (future position)
        }
        */

        let xPos = this.position.x;
        let yPos = this.position.y;

        if (!this.bounced) {
            xPos += this.velocity.x;
            yPos += this.velocity.y;
        }

        return {
            x: xPos,
            y: yPos
        }
    }


    isOutsideBorders(size) {
        /*
        returns true if the rectanle is outside of the walls
        false otherwise. 
        */

        return (
            (this.position.x + this.size.width > size.width || this.position.x < 0) || 
            (this.position.y + this.size.height > size.height || this.position.y < 0)
        )
    }


    handleWallCollide(size) {
        /*
        size : {
            width : width of the screen
            height : height of the screen
        }
        position = {
            x : number, (future position)
            y : number (future position)
        }
        check if the dvd is going to collide with a wall. If so, updats the velocity to avoid that.
        returns false if the dvd did not collide with a wall
        returns true if the dvd collided with a wall and the velocity was updated
    
        returns -> boolean
        }
        */
        let position = this.getFuturePosition();
        
        if (position.x + this.size.width > size.width || position.x < 0) {
            this.velocity.x *= -1;
            return true;
        }
        if (position.y + this.size.height > size.height || position.y < 0) {
            this.velocity.y *= -1;
            return true;
        }
        return false;
    }


    getBorders(position = null) {
        /*
        get the borders of the piece at this position.
    
        position = {
            x : number, (future position)
            y : number (future position)
        }
    
        -> returns [left x, top y, right x, bottom y]
        */

        if (position === null) {
            position = this.position;
        }

        return [position.x, position.y, position.x + this.size.width, position.y + this.size.height];
    }


    checkCollission(other) {
        /*
        other : Rectangle
        check if two rectangles are going to collide returns true if they will. 
        False otherwise. 
    
        -> returns boolean
        */

        // If one rectangle is on left side of other
        let futurePosition = this.getFuturePosition();

        let [left1, top1, right1, bottom1] = this.getBorders(futurePosition); //currents future position 
        let [left2, top2, right2, bottom2] = other.getBorders(); //others current position 

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


    collide(other) {
        /*
        other : Rectangle
    
        swaps the velocities of the two rectangles 
        */

        let otherVelocity = other.velocity;
        other.velocity = this.velocity;
        this.velocity = otherVelocity;
    }


    update() {
        /*
        update the rectangles position 
        */
        this.position = this.getFuturePosition();
    }


    draw(ctx) {
        /*
        ctx : canvas 2d contect  
    
        draws the rectangle to the canvas
        */

        ctx.fillStyle = 'green';
        ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    }
}


export default Rectangle;