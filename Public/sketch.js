// Multiplayer
let socket;
let moveData;
let p, game, id;
const MAX_HEALTH = 120;
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
    window.addEventListener("focus", ()=>{
        document.title = "Tank Game ⁍";
        socket.on('heartbeat', (data)=>{
            enemies = data;
        });
    })
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
    pos = createVector(random(300), random(300));
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
        health: MAX_HEALTH,
    };
    console.log(moveData);

    //Send data
    socket.emit('start', moveData);

    // Seeds
    randomSeed(100);
    noiseSeed(100);

    // Parameters
    terrain = new Terrain(TERRIAN_BLOCK_SIZE);
    p = new Player(pos, playerRot, turretRot, color, turret, MAX_HEALTH);
    game = new Game(p, terrain);

    //Other Important Variables
    keyIsReleased = false;
}

function windowResized() {
    var winX = (windowWidth - width) / 2;
    var winY = (windowHeight - height) / 2;
    cnv.position(winX, winY);
}

function collissionBullet(pos, size){
    let collision = collideRectRectVector(p.pos, p.size, pos, size);
    return collision
}

function updateBullets(){
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].move();
        bullets[i].display();
        if (!bullets[i].isAlive()) {
            bullets.shift();
            i -= 1;
        }
        if (bullets[i] && collissionBullet(bullets[i].pos, bullets[i].size)) {
            p.health -= 36;
            bullets.shift();
            i -= 1;
        }

    }
}


function draw() {
    window.onfocus = () => {
        document.title = "Tank Game ⁍";
    };
    window.onblur = () => {
        document.title = "[!] Tank Game ⁍"
    };
    
    socket.off('createBullet').on('createBullet', (data)=>{
        const POS = createVector(data.x, data.y);
        const VEL = createVector(data.velX, data.velY);
        if(data.id != moveData.id){
            bullets.push(new EnemyBullet(POS, data.bulletRot, VEL, data.turret));
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
function healthBar(health, pos) {
    rectMode(CORNER);
    fill(255, 255, 255);
    rect(pos.x-42, pos.y-80, 84, 10);
    fill(100, 255, 100);
    rect(
        pos.x-42,
        pos.y-80,
        map(
            health,
            0,
            MAX_HEALTH,
            0,
            84,
            true
        ),
        10
    );
}

function updateEnemies(){
    for (const id in enemies){
        if (id != moveData.id){
            push();
            translate(width/2 + p.pos.x, height/2 + p.pos.y);
            healthBar(enemies[id].health, createVector(enemies[id].x, enemies[id].y));
            translate(enemies[id].x, enemies[id].y);
            rotate(enemies[id].playerRot);
            translate(- enemies[id].x, - enemies[id].y);

            image(bodyImgs[enemies[id].color], enemies[id].x, enemies[id].y, 56, 56);

            translate(enemies[id].x, enemies[id].y);
            rotate(enemies[id].turretRot);
            translate(-enemies[id].x, -enemies[id].y);

            image(turretImgs[`${enemies[id].turret}${enemies[id].color}`], enemies[id].x, enemies[id].y, 28, 53);
            pop();
            let sz = createVector(56, 56);
            let enemPos = createVector(-enemies[id].x, -enemies[id].y);
            collissionDetect(enemPos, sz)
        }
        
    }
    function collissionDetect(pos, size){
        let collision = collideRectRectVector(p.pos, size, pos, size);
        if (collision){
            if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
                p.pos.x += p.speed * 1.22 * cos(90 - p.rotation);
                p.pos.y -= p.speed * 1.22 * sin(90 - p.rotation);
            }
            if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
                p.pos.x -= p.speed * 1.22 * cos(90 - p.rotation);
                p.pos.y += p.speed * 1.22 * sin(90 - p.rotation);
            }
            if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
                p.rotation += 2;
            }
            if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
                p.rotation -= 2;
            }
        }
    }

    

}