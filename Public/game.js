class Game {
  constructor(player, terrain) {
    this.player = player;
    this.terrain = terrain;
  }
  getEvents() {
    socket.on("heartbeat", (data) => {
      enemies = data;
      // console.log(enemies);
    });
    socket.on("gameData", (data) => {
      playerCount = data.playerCount;
      // console.log(enemies);
    });
    socket.off("createBullet").on("createBullet", (data) => {
      const POS = createVector(data.x, data.y);
      const VEL = createVector(data.velX, data.velY);
      if (data.id != moveData.id) {
        bullets.push(new EnemyBullet(POS, data.bulletRot, VEL, data.turret));
      }
      // console.log(bullets);
    });
    socket.on("bullet_hit_unfocused", (data) => {
      console.log(data.health);
      moveData = data;
      p.health = data.health;
      console.log("made it");
    });
  }

  draw() {
   
    push();
    translate(this.player.pos.x, this.player.pos.y);
    this.terrain.drawTiles();
    this.player.display();
    this.player.update();
    // this.terrain.drawPlants();
    pop();

    this.updateBullets();
    this.updateEnemies();
  }

  healthBar(health, pos) {
    rectMode(CORNER);
    fill(255, 255, 255);
    rect(pos.x - 42, pos.y - 80, 84, 10);
    fill(100, 255, 100);
    rect(pos.x - 42, pos.y - 80, map(health, 0, MAX_HEALTH, 0, 84, true), 10);
  }

  collissionBullet(pos, size) {
    let collision = collideRectRectVector(p.pos, p.size, pos, size);
    return collision;
  }

  updateBullets() {
    for (let i = 0; i < bullets.length; i++) {
      bullets[i].move();
      bullets[i].display();
      if (!bullets[i].isAlive()) {
        bullets.shift();
        i -= 1;
      }
      if (bullets[i] && this.collissionBullet(bullets[i].pos, bullets[i].size)) {
        //   p.health -= 36;
        bullets.shift();
        i -= 1;
      }
    }
  }
updateEnemies() {
    for (const id in enemies) {
      if (id != moveData.id) {
        push();
        translate(width / 2 + p.pos.x, height / 2 + p.pos.y);
        this.healthBar(enemies[id].health, createVector(enemies[id].x, enemies[id].y));
        translate(enemies[id].x, enemies[id].y);
        rotate(enemies[id].playerRot);
        translate(-enemies[id].x, -enemies[id].y);
  
        image(bodyImgs[enemies[id].color], enemies[id].x, enemies[id].y, 56, 56);
  
        translate(enemies[id].x, enemies[id].y);
        rotate(enemies[id].turretRot);
        translate(-enemies[id].x, -enemies[id].y);
  
        image(
          turretImgs[`${enemies[id].turret}${enemies[id].color}`],
          enemies[id].x,
          enemies[id].y,
          28,
          53
        );
        pop();
        let sz = createVector(56, 56);
        let enemPos = createVector(-enemies[id].x, -enemies[id].y);
        this.collissionDetect(enemPos, sz);
        if (enemies[id].health <= 0) {
          kills += 1;
          console.log(kills)
        }
      }
    }
}
  collissionDetect(pos, size) {
    let collision = collideRectRectVector(p.pos, size, pos, size);
    if (collision) {
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
