let folder = "Assets/Bodies";

let p, game;

// Variable for the canvas
let cnv;

let bulletImgs = [];

// To make it run faster
p5.disableFriendlyErrors = true;

// This variable is only needed for making the shooting mechanic work, I wish I didn't have to but IDK if I can go without. Too lazy to research right now so future Rohan might find the solution.
let keyIsReleased;

//UI
let ui;

// Make terrain generator
let terrain;

// Game Mode
const TERRIAN_BLOCK_SIZE = 15;

function preload() {
    // Load bullets beforehand for performance
    for (let i = 0; i < 3; i++) {
        bulletImgs[i] = loadImage(`Assets/bullets/${i + 1}.png`);
    }
}

function setup() {
    // cnv = createCanvas(1024, 600);
    cnv = createCanvas(displayWidth * 0.99, displayHeight * 0.8);
    cnv.parent("sketch01");

    // Prevents right-click from creating dialouge on canvas
    document.addEventListener("contextmenu", (event) => event.preventDefault());

    // To Center the Canvas
    var winX = (windowWidth - width) / 2;
    var winY = (windowHeight - height) / 2;
    cnv.position(winX, winY);

    imageMode(CENTER);
    angleMode(DEGREES);

    // Seeds
    randomSeed(100);
    noiseSeed(100);

    terrain = new Terrain(TERRIAN_BLOCK_SIZE);
    p = new Player(createVector(0, 0), "Red", 3);
    game = new Game(p, terrain);

    console.log(p.pos);
    //Other Important Variables
    keyIsReleased = false;
}

function windowResized() {
    var winX = (windowWidth - width) / 2;
    var winY = (windowHeight - height) / 2;
    cnv.position(winX, winY);
}

function draw() {
    // scale(0.5);
    game.draw();
}

function keyPressed() {
    if (keyCode == 32) keyIsReleased = true;
}

function keyReleased() {
    if (keyIsReleased) keyIsReleased = false;
}
