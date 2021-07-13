class Player {
    constructor(playerPos, tankColor, turretType) {
        // A Vector (x, y) is the offset for the translate function
        this.pos = playerPos;

        /***
         * Color Types: Blue, Dark, Green, Red, or Sand
         * IMPORTANT: FIRST LETTER NEEDS TO BE CAPITAL BECAUSE OF THE DUMB NAMING CONVENTION I PICKED FOR THE NAMES
         *  */
        this.color = tankColor;
        this.turret = turretType; // 1, 2, 3

        // Movement Vars
        this.rotation = 0;
        this.turretRotation = 0;
        this.speed = 3;

        // Vars used for Shooting Mechanics
        this.firing = false; // Boolean
        this.bullets = []; // Array of Bullet Objects
        this.lastShotTime = 0;
        this.timeOut = 1000; // Timeout in milliseconds for shooting
        this.bulletSpeed = 7;

        this.bodyImg = loadImage(
            `Assets/Bodies/tankBody_${this.color.toLowerCase()}.png`
        );
        this.turretImg = loadImage(
            `Assets/Turrets/tank${this.color}_barrel${this.turret}.png`
        );
    }

    display() {
        this.fireInput();
        // Display All bullets
        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].move();
            this.bullets[i].display();
            if (!this.bullets[i].isAlive()) {
                this.bullets.shift();
                i -= 1;
            }
        }

        push();
        translate(width / 2 - this.pos.x, height / 2 - this.pos.y);

        rotate(this.rotation);
        image(this.bodyImg, 0, 0, 56, 56);

        this.turretInput();
        rotate(this.turretRotation);
        image(this.turretImg, 0, 0 - 5, 28, 53);
        // console.log(this.turretImg.width);
        // console.log(this.turretImg.height);
        pop();

        push();
        translate(width / 2 - this.pos.x, height / 2 - this.pos.y);
        rotate(this.rotation);
        this.reloadBar();
        pop();
    }

    update() {
        this.rotation = this.rotation % 360;
        this.moveInput();
    }

    reloadBar() {
        rectMode(CORNER);
        rect(-42, -60, 84, 10);
        fill(255, 255, 102);
        rect(
            -42,
            -60,
            map(
                this.lastShotTime + this.timeOut - millis(),
                0,
                this.timeOut,
                84,
                0,
                true
            ),
            10
        );
    }

    // WASD or Arrowkeys to move tank body
    moveInput() {
        if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
            this.pos.x -= this.speed * cos(90 - this.rotation);
            this.pos.y += this.speed * sin(90 - this.rotation);
        }
        if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
            this.pos.x += this.speed * cos(90 - this.rotation);
            this.pos.y -= this.speed * sin(90 - this.rotation);
        }
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
            this.rotation -= 2;
        }
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
            this.rotation += 2;
        }
    }

    // Left-click or Right-click to move turret
    turretInput() {
        if (mouseIsPressed) {
            if (mouseButton == LEFT) {
                this.turretRotation -= 1;
            } else if (mouseButton == RIGHT) {
                this.turretRotation += 1;
            }
        }
    }

    // Fire Input
    fireInput() {
        if (
            keyCode == 32 &&
            keyIsReleased &&
            (this.lastShotTime + this.timeOut <= millis() ||
                this.lastShotTime == 0)
        ) {
            console.log(`FPS: ${frameRate()}`);

            this.lastShotTime = millis();
            this.firing = true;

            const vel = createVector(
                -this.bulletSpeed *
                    cos(90 - this.rotation - this.turretRotation),
                this.bulletSpeed * sin(90 - this.rotation - this.turretRotation)
            );
            this.bullets.push(
                new Bullet(
                    this.pos,
                    this.rotation + this.turretRotation,
                    vel,
                    this.turret
                )
            );
            keyCode += 21;
        }
    }
}
