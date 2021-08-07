// Multiplayer
let socket;

let moveData;
let p, game, id;
let enemies = [];
let bullets = [];
let colors = ["Red", "Blue", "Green", "Sand"];
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
    //Connect client to server
    socket = io.connect('http://localhost:3000');
    socket.on("connect", () => {
        id = socket.id; 
        console.log(id);

    });

    // Load bullets beforehand for performance
    for (let i = 0; i < 3; i++) {
        bulletImgs[i] = loadImage(`Assets/bullets/${i + 1}.png`);
    }
    for (let color of colors){
        bodyImgs[color] = loadImage(
            `Assets/Bodies/tankBody_${color.toLowerCase()}.png`
        );
        for (let i=1; i<4; i++){
            turretImgs[`${i}${color}`] = loadImage(
                `Assets/Turrets/tank${color}_barrel${i}.png`
            );
        }
        
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

    //Changing modes
    imageMode(CENTER);
    angleMode(DEGREES);



    //Get ID on connection
    
    //Data to be sent to the client
    pos = createVector(0, 0);
    let playerRot = 0;
    let turretRot = 0;
    let color = colors[ Math.floor((Math.random() * colors.length))]
    let turret = Math.ceil(Math.random() * 3);
    moveData = {
        x: pos.x,
        y: pos.y,
        playerRot: 0,
        turretRot: 0,
        id: id,
        color: color,
        turret: turret,
    };
    console.log(moveData);

    //Send data
    socket.emit('start', moveData);

    // Seeds
    randomSeed(100);
    noiseSeed(100);

    // Parameters
    terrain = new Terrain(TERRIAN_BLOCK_SIZE);
    p = new Player(pos, playerRot, turretRot, color, turret);
    game = new Game(p, terrain);

    //Other Important Variables
    keyIsReleased = false;
}

function windowResized() {
    var winX = (windowWidth - width) / 2;
    var winY = (windowHeight - height) / 2;
    cnv.position(winX, winY);
}
function updateBullets(){
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].move();
        bullets[i].display();
        if (!bullets[i].isAlive()) {
            bullets.shift();
            i -= 1;
        }
    }
}

function draw() {
    socket.on('heartbeat', (data)=>{
        enemies = data;
    });
    socket.off('createBullet').on('createBullet', (data)=>{
        const POS = createVector(data.x, data.y);
        const VEL = createVector(data.velX, data.velY);
        if(data.id != moveData.id){
            bullets.push(new EnemyBullet(POS, data.bulletRot, VEL, data.turret));
            console.log(bullets);
        }
        // console.log(bullets);
    });
    // scale(0.5);
    game.draw();
    updateBullets();
    updateEnemies();

}

function keyPressed() {
    if (keyCode == 32) keyIsReleased = true;
}

function keyReleased() {
    if (keyIsReleased) keyIsReleased = false;
}

function updateEnemies(){
    for (const id in enemies){
        if (id != moveData.id){
            push();
            translate(width/2 + p.pos.x, height/2 + p.pos.y);

            translate(enemies[id].x, enemies[id].y);
            rotate(enemies[id].playerRot);
            translate(- enemies[id].x, - enemies[id].y);

            image(bodyImgs[enemies[id].color], enemies[id].x, enemies[id].y, 56, 56);

            translate(enemies[id].x, enemies[id].y);
            rotate(enemies[id].turretRot);
            translate(-enemies[id].x, -enemies[id].y);

            image(turretImgs[`${enemies[id].turret}${enemies[id].color}`], enemies[id].x, enemies[id].y, 28, 53);
            pop();
        }
        
    }

    

}