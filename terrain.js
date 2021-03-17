class Terrain{
    constructor(renderSize){
        this.size = renderSize;
        this.middleX = width/2;
        this.middleY = height/2;
        this.tiles = []
        this.offsetY = 0;
        this.offsetX = 0;
        this.poffsetY = 0;
        this.poffsetX = 0;
        // Tiles are 64 by 64
        for (let i=0; i<4; i++){
            this.tiles[i] = loadImage(`Assets/terrain/${i+1}.png`);
        }
    }

    draw(){
        this.poffsetX = this.offsetX;
        this.poffsetY = this.offsetY;
        this.offsetX = Math.ceil((p.pos.x - width/2)/64);
        this.offsetY = Math.ceil((p.pos.y - height/2)/64);
        let xOff = 0 - 0.04*(Math.ceil(this.offsetX));
        for (let x = -this.size-this.offsetX; x<=this.size-this.offsetX; x++){
            let yOff = 0 - 0.04*(Math.ceil(this.offsetY));
            for (let y = -this.size-this.offsetY; y<=this.size-this.offsetY; y++ ){
                let i = Math.floor(noise(xOff, yOff) * 3.999999999)
                image(this.tiles[i], x*64, y*64);
                yOff += 0.04;
            }
            xOff += 0.04;
        }
    }
}