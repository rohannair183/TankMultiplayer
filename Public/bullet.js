class Bullet {
    constructor(pos, rotation, velocity, bulletType) {
        imageMode(CENTER);
        this.type = bulletType;
        this.pos = createVector(pos.x, pos.y);
        this.velocity = velocity;
        this.rotation = rotation;
        this.birthTime = millis();
        this.size = createVector(Math.floor(bulletImgs[this.type - 1].width * (6 / 8)), Math.floor(bulletImgs[this.type - 1].height * (6 / 8)));
        this.alive = true;

    }

    display() {
        push();
        translate(width / 2 - this.pos.x, height / 2 - this.pos.y);
        rotate(this.rotation);
        image(
            bulletImgs[this.type - 1],
            0,
            0,
            Math.floor(bulletImgs[this.type - 1].width * (6 / 8)),
            Math.floor(bulletImgs[this.type - 1].height * (6 / 8))
        );
        pop();
    }

    move() {
        this.pos.add(this.velocity);
        // console.log(`X: ${this.pos.x}, Y: ${this.pos.y}`);
    }

    isAlive() {
        if (millis() - this.birthTime > 4000) {
            return false;
        }
        return true;
    }
}
