/// <reference path="./lib/p5.global-mode.d.ts"/>

let spriteSheet,
    isGenerated = false,
    debugMode = false,
    fr = 20;

function debug() {
    stroke(10,220,10);
    frameRate(fr);
    for (let collision of staticCollisions) {
        if (collision.col !== undefined) {
            fill (collision.col);
        }else {
            fill(0, 50);
        }
        rect(collision.x, collision.y, collision.width, collision.height);
    }
    rect(player.pos.x, player.pos.y, player.size, player.size);
}

function setup() {
    createCanvas(1280, 720);
}

function draw() {
    if (imageFileStatus == 1) {
        spriteSheet = loadSprites(30);        
        imageFileStatus = 0;
    }
    if (!isGenerated && textFileStatus == 1) {
        generateMap(spriteSheet);
        isGenerated = true;
        textFileStatus = 0;
    }
    if(isGenerated) {
        clear();
        drawMap();
        player.move(staticCollisions);
    }
    if (debugMode) {
        debug();
    }
}