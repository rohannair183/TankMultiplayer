class Game {
    constructor(player, terrain) {
        this.player = player;
        this.terrain = terrain;
    }

    draw() {
        push();
        translate(this.player.pos.x, this.player.pos.y);
        this.terrain.drawTiles();
        this.player.display();
        this.player.update();
        // this.terrain.drawPlants();
        pop();
    }
}
