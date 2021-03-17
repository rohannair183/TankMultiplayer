class Bullet {
    constructor(pos, rotation, velocity, bulletType) {
        imageMode(CENTER);
	    this.type = bulletType;
        this.pos = createVector(0, -8);
        this.velocity = velocity;
        this.rotation = rotation;
        this.birthTime = millis();
		}

    display() {
        push();
        rotate(this.rotation);
        image(bulletImgs[this.type - 1], this.pos.x, this.pos.y);
        // circle(-4, 240, 100);
        pop();
    }

    move() {
        this.pos.add(this.velocity);
    }

    isAlive() {
        if (millis() - this.birthTime > 8000) {
            return false;
        }
        return true;
    }
}