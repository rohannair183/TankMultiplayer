class Terrain {
    constructor(renderSize) {
        // The number of tiles in each direction the image extends
        this.size = renderSize;

        // Images of tiles
        this.tiles = [];

        // Images of plants
        this.plants = [];

        // Offsets for perlin noise
        this.offsetY = 0;
        this.offsetX = 0;

        // Loads all assets
        this.loadImages();

        // Write Comment
        this.terrianIndex = [];
    }

    loadImages() {
        // Tiles are 64 by 64
        for (let i = 0; i < 4; i++) {
            this.tiles[i] = loadImage(`Assets/terrain/${i + 1}.png`);
        }
    }

    drawTiles() {
        push();
        // scale(0.75);
        this.terrianIndex = [];
        this.offsetX = Math.ceil((p.pos.x - width / 2) / 64);
        this.offsetY = Math.ceil((p.pos.y - height / 2) / 64);
        let xOff = 0 - 0.04 * Math.ceil(this.offsetX);
        for (
            let x = -this.size - this.offsetX;
            x <= this.size - this.offsetX;
            x++
        ) {
            let yOff = 0 - 0.04 * Math.ceil(this.offsetY);
            for (
                let y = -this.size - this.offsetY;
                y <= this.size - this.offsetY;
                y++
            ) {
                let i = Math.floor(noise(xOff, yOff) * 3.999999999);
                this.terrianIndex.push(i);
                image(this.tiles[i], x * 64, y * 64);
                yOff += 0.04;
            }
            xOff += 0.04;
        }
        pop();
    }

    // drawPlants() {
    //     imageMode(CENTER);
    //     this.offsetX = Math.ceil((p.pos.x - width / 2) / 64);
    //     this.offsetY = Math.ceil((p.pos.y - height / 2) / 64);

    //     let xOff = 0 - 1500000 * Math.ceil(this.offsetX);

    //     let i = 0;

    //     for (
    //         let x = -this.size - this.offsetX;
    //         x <= this.size - this.offsetX;
    //         x++
    //     ) {
    //         let yOff = 0 - 1500000 * Math.ceil(this.offsetY);
    //         for (
    //             let y = -this.size - this.offsetY;
    //             y <= this.size - this.offsetY;
    //             y++
    //         ) {
    //             let rand = noise(xOff, yOff);
    //             let index = this.terrianIndex[i];
    //             if (rand * 100 <= 15) {
    //                 if (index <= 1) {
    //                     image(this.plants[0], x * 64 + 64, y * 64 + 64);
    //                 } else if (index > 1) {
    //                     image(this.plants[1], x * 64 + 64, y * 64 + 64);
    //                 }
    //             }
    //             i += 1;
    //             yOff += 1500000;
    //         }
    //         xOff += 1500000;
    //     }
    //     imageMode(CENTER);
    // }
}
