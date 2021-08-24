class Player {
  constructor(
    playerPos,
    playerRotation,
    turretRotation,
    tankColor,
    turretType,
    maxHealth
  ) {
    // A Vector (x, y) is the offset for the translate function
    this.pos = playerPos;

    /***
     * Color Types: Blue, Dark, Green, Red, or Sand
     * IMPORTANT: FIRST LETTER NEEDS TO BE CAPITAL BECAUSE OF THE DUMB NAMING CONVENTION I PICKED FOR THE NAMES
     *  */
    this.color = tankColor;
    this.turret = turretType; // 1, 2, 3
    this.maxHealth = maxHealth;
    this.health = this.maxHealth;
    this.size = createVector(56, 56);

    // Movement Vars
    this.rotation = playerRotation;
    this.turretRotation = turretRotation;
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
      if (
        this.bullets[i] &&
        this.collission(this.bullets[i].pos, this.bullets[i].size).collide
      ) {
        id = this.collission(this.bullets[i].pos, this.bullets[i].size).player;
        enemies[id].health -= 36;
        this.bullets.splice(i, 1);
        socket.emit("bullet_hit_unfocused", enemies[id]);
        console.log(enemies[id].health);
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
    pop();

    push();
    translate(width / 2 - this.pos.x, height / 2 - this.pos.y);
    rotate(this.rotation);
    this.reloadBar();
    this.healthBar();
    pop();

    if (this.health <= 0) {
      socket.emit("dead", moveData);
    }
  }

  update() {
    this.rotation = this.rotation % 360;
    this.moveInput();
    moveData.x = -this.pos.x;
    moveData.y = -this.pos.y;
    moveData.playerRot = this.rotation;
    moveData.turretRot = this.turretRotation;
    moveData.focus = tabFocus;
    moveData.health = this.health;
    console.log()
    socket.emit("move", moveData);
  }

  reloadBar() {
    rectMode(CORNER);
    fill(255, 255, 255);
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
  healthBar() {
    rectMode(CORNER);
    fill(255, 255, 255);
    rect(-42, -80, 84, 10);
    fill(100, 255, 100);
    rect(-42, -80, map(this.health, 0, this.maxHealth, 0, 84, true), 10);
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
      (this.lastShotTime + this.timeOut <= millis() || this.lastShotTime == 0)
    ) {
      console.log(`FPS: ${frameRate()}`);
    //   console.log(this.bullets);
      const VEL = createVector(
        -this.bulletSpeed * cos(90 - this.rotation - this.turretRotation),
        this.bulletSpeed * sin(90 - this.rotation - this.turretRotation)
      );
      this.lastShotTime = millis();
      this.firing = true;

      //Emit socket event that a bullet was fired
      let fireData = {
        id: moveData.id,
        x: this.pos.x,
        y: this.pos.y,
        bulletRot: this.rotation + this.turretRotation,
        velX: VEL.x,
        velY: VEL.y,
        turret: this.turret,
        birthTime: millis(),
      };

      socket.emit("fire", fireData);

      this.bullets.push(
        new Bullet(
          this.pos,
          this.rotation + this.turretRotation,
          VEL,
          this.turret
        )
      );
      keyCode += 21;
    }
  }
  collission(pos, size) {
    for (const id in enemies) {
      if (!id) {
        return { collide: false };
      }
      if (id != moveData.id) {
        let sz = createVector(56, 56);
        let enemPos = createVector(-enemies[id].x, -enemies[id].y);
        let collision = collideRectRectVector(enemPos, sz, pos, size);
        return { collide: collision, player: enemies[id].id };
      }
      return { collide: false };
    }
    return { collide: false };
  }
}
