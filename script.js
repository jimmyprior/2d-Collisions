import Rectangle from "./rectangle.js"


const maxVelocity = 10; //in pixels 
const rectSize = {width : 200, height : 100}; 
const updateInterval = 10;

const canvas = document.getElementById("collider");
const ctx = canvas.getContext("2d");

let size = {
	width: null,
	height: null
}

const rectangles = []
const ghosts = []


function* rects(rectangle) {
	/*
	generator that yields all the rects except the param rect
	returns -> Rectangle 
	*/
	for (let other of rectangles) {
		if (Object.is(rectangle, other)) {
			//dont yield self
			continue;
		}
		yield other;
	}
}


function getRandomVelocity() {
	return Math.ceil(Math.random() * maxVelocity)
}


function handleCollissions(rectangle) {
	/*
	rectange : Rectangle

	check if the dvd is going to collide with any other dvds 
	if it will, collide it and change the velocities

	returns -> boolean 
	(true is it collides, false if it did not )
	*/
	let position = rectangle.getFuturePosition();
	let collided = false;
	for (let other of rects(rectangle)) {
		if (rectangle.checkCollission(other, position)) {
			rectangle.collide(other);
			collided = true;
		}
	}
	return collided;
}


function checkIntersects(rectangle) {
	/*
	-> true (intersects other rects)
	-> false (does not intersect other rects)

	check if a rectangle intersects with any other rectangles
	*/

	for (let other of rects(rectangle)) {
		if (rectangle.checkCollission(other)) {
			return true;
		}
	}
	return false
}


function draw() {
	/*
	clear the canvas and draw the rectangles to the canvas
	*/
	ctx.clearRect(0, 0, size.width, size.height); //wipe it 

	for (let rectangle of rectangles) {
		rectangle.draw(ctx);
	}

	for (let ghost of ghosts) {
		ghost.draw(ctx)
	}
}


function onUpdate() {
	/*
	update the rectangles
	*/
	//convert eligible ghosts to rectangles
	for (let i = ghosts.length - 1; i >= 0; i--) {
		let rectangle = ghosts[i];
		if (!checkIntersects(rectangle)) {
			rectangles.push(rectangle)
			ghosts.splice(i, 1);
		}
	}

	//update rectangle positions
	for (let rectangle of rectangles) {
		if (handleCollissions(rectangle)) {
			//if collided, do not update position
			continue;
		}

		if (rectangle.handleWallCollide(size)) {
			//if it hit a wall, do not update position
			continue;
		}

		rectangle.update();
	}

	//have ghosts bounce of walls 
	for (let ghost of ghosts) {
		if (ghost.handleWallCollide(size)) {
			//if it hit a wall, do not update position
			continue;	
		}
		ghost.update();
	}

	draw(); //draw everything to the canvas
}


function removeOutOfBoundsRects(rects) {
	/*
	rectangles : list

	removes rectangles that are outside of the screen
	takes a list of rectangles and modifies it.
	*/
	for (let i = rects.length -1; i >= 0; i--) {
		let rectangle = rects[i]
		if (rectangle.isOutsideBorders(size)) {
			rects.splice(i, 1);
		}
	}
}


function onResize() {
	/*
	resize the board
	remove all of the dvds outside of the board.
	*/
	size = {
		width: document.body.clientWidth,
		height: document.body.clientHeight
	}
	canvas.width = size.width;
	canvas.height = size.height;

	//remove rectangles that are outside of the screen
	removeOutOfBoundsRects(rectangles);
	removeOutOfBoundsRects(ghosts);
}


function onClick(event) {
	/* 
	spawn in a new rectangle
	https://stackoverflow.com/a/18053642
	*/
	const rect = canvas.getBoundingClientRect();
	let x = event.clientX - rect.left;
	let y = event.clientY - rect.top;

	if (x > size.width / 2) {
		x -= rectSize.width;
	}

	if (y > size.height / 2) {
		y -= rectSize.height;
	}

	let rectangle = new Rectangle(
		rectSize.width, rectSize.height, 
		x, y,
		getRandomVelocity(), getRandomVelocity()
	);
	
	ghosts.push(rectangle);
}



onResize();
window.addEventListener("resize", onResize);
canvas.addEventListener("click", onClick);

setInterval(onUpdate, updateInterval);