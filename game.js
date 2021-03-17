class Game{

    constructor(player, terrain){
        this.player = player;
        this.terrain = terrain;
    }

    draw(){
        translate(this.player.pos.x, this.player.pos.y);
        this.terrain.draw();
        this.player.display();
        this.player.update();

    }
}