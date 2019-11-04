function setup() {
  createCanvas(windowWidth, windowHeight);
  background(250);
}

function draw() {
  stroke(10);
  strokeWeight(2);
  if (mouseIsPressed === true) {
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}