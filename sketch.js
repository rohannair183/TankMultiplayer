
let img;
let p, p2, game;
let cnv;
let keyIsReleased;
let bulletImgs = [];
p5.disableFriendlyErrors = true;


function preload(){
  for (let i=0; i<3; i++){
    bulletImgs[i] = loadImage(`Assets/bullets/${i+1}.png`);
  }
}


function setup() {
  console.log(bulletImgs);
  cnv = createCanvas(1024, 640);
  document.addEventListener('contextmenu', event => event.preventDefault());  // To Center the Canvas

  var winX = (windowWidth - width) / 2;
  var winY = (windowHeight - height) / 2;
  cnv.position(winX, winY);

  imageMode(CENTER);
  angleMode(DEGREES);
  
  terrain = new Terrain(9);
  p = new Player(createVector(random(width), random(height)), 'Red', 1);
  game = new Game(p, terrain);

  //Other Important Variables
  keyIsReleased = false;
}

function windowResized(){
  var winX = (windowWidth - width) / 2;
  var winY = (windowHeight - height) / 2;
  cnv.position(winX, winY);
}

function draw() {
  scale(1);
  background(0);
  game.draw(); 
}

function keyPressed(){
  if (keyCode == 32) keyIsReleased = true;
  console.log('hey>');
}

function keyReleased(){
  if (keyIsReleased) keyIsReleased = false;
}