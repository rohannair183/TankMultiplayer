// Multiplayer
let socket;
let moveData;
let p, game, id;
const MAX_HEALTH = 120;
let enemies = [];
let bullets = [];
let colors = ["Red", "Blue", "Green", "Sand"];
let tabFocus; // wheter tab is in focus or not
let playerCount;
let kills = 0;
// Variable for the canvas
let cnv;

let bulletImgs = [];
let bodyImgs = {};
let turretImgs = {};

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
console.log(localStorage.getItem('tankUsername'));
  //Connect client to server
  socket = io();
  socket.on("connect", () => {
    id = socket.id;
    console.log(id);
  });

  // Load bullets beforehand for performance
  for (let i = 0; i < 3; i++) {
    bulletImgs[i] = loadImage(`Assets/bullets/${i + 1}.png`);
  }
  for (let color of colors) {
    bodyImgs[color] = loadImage(
      `Assets/Bodies/tankBody_${color.toLowerCase()}.png`
    );
    for (let i = 1; i < 4; i++) {
      turretImgs[`${i}${color}`] = loadImage(
        `Assets/Turrets/tank${color}_barrel${i}.png`
      );
    }
  }
}

function setup() {
    window.onbeforeunload = function() {
        window.location = "main.html"; 
    }
  window.addEventListener("focus", () => {
    document.title = "Tank Game ⁍";
    tabFocus = true;
  });
  window.addEventListener("blur", () => {
    tabFocus = false;
    document.title = "[!] Tank Game ⁍";
    moveData.x = -p.pos.x;
    moveData.y = -p.pos.y;
    moveData.playerRot = p.rotation;
    moveData.turretRot = p.turretRotation;
    moveData.focus = tabFocus;
    moveData.health = p.health;
    console.log(`movedata: ${moveData.health}`);
    console.log();
    socket.emit("move", moveData);
  });
  // cnv = createCanvas(1024, 600);
  cnv = createCanvas(displayWidth * 0.99, displayHeight * 0.8);
  cnv.parent("sketch01");

  // Prevents right-click from creating dialouge on canvas
  document.addEventListener("contextmenu", (event) => event.preventDefault());

  // To Center the Canvas
  var winX = (windowWidth - width) / 2;
  var winY = (windowHeight - height) / 2;
  cnv.position(winX, winY);

  //Changing modes
  imageMode(CENTER);
  angleMode(DEGREES);

  //Data to be sent to the client
  pos = createVector(random(300), random(300));
  let playerRot = 0;
  let turretRot = 0;
  let color = colors[Math.floor(Math.random() * colors.length)];
  let turret = Math.ceil(Math.random() * 3);
  moveData = {
    x: pos.x,
    y: pos.y,
    playerRot: 0,
    turretRot: 0,
    id: id,
    color: color,
    turret: turret,
    health: MAX_HEALTH,
    focus: tabFocus,
  };
  console.log(moveData);

  //Send data
  socket.emit("start", moveData);

  // Seeds
  randomSeed(100);
  noiseSeed(100);

  // Parameters
  terrain = new Terrain(TERRIAN_BLOCK_SIZE);
  p = new Player(pos, playerRot, turretRot, color, turret, MAX_HEALTH);
  game = new Game(p, terrain);
  setInterval(draw(), 10);
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
  game.getEvents();
  game.draw();
  
}

function keyPressed() {
  if (keyCode == 32) keyIsReleased = true;
}

function keyReleased() {
  if (keyIsReleased) keyIsReleased = false;
}