class SpriteSheet {
    constructor() {
        this.sprites = {};
        this.size;
    }

    /**
     * Adds a single sprite to the grouped spritesheet. Where all the sprites can be accesed.
     * 
     * @param {Text} spriteName     Name of the sprite
     * @param {Image} sprite        The loadImage() sprite
     * @param {Number} size         The size of said sprite
     */
    addToSheet(spriteName, sprite, size) {
        this.sprites[spriteName] = new Sprite(sprite, size);
        if (this.size == null) {
            this.size = size;
        }
    }
}


class Sprite {
    /**
     * A single sprite object Contains anything that modifies the sprite / image itself.
     * 
     * @param {Image} sprite        Sprite tha is to be loaded for this object
     * @param {Number} size         The size of the said sprite.
     */
    constructor (sprite, size) {
        this.sprite = sprite;
        this.size = size;
    }

    /**
     * Draw the said sprite
     * 
     * @param {Number} x            The x position of the sprite
     * @param {Number} y            The y position of the sprite
     * @param {Number} size         The size of the sprite
     */
    draw(x, y, size) {
        image(this.sprite, x, y, size, size);
    }
}

class Player extends Sprite{
    /**
     * The Player object which extends the Sprite object. Object which will be controlled by the player.
     * 
     * @param {Image} sprite        The sprite that is meant to be loaded onto the Player's super 
     * @param {Number} size         The size of the sprite that is meant to be loaded onto the Player's super
     * @param {Object} pos          The position of the sprite.
     */
    constructor(sprite, size, pos){
        super(sprite, size);
        this.size = size;
        this.gravity = 1;
        this.friction = 1;
        this.CONTROLS = {
            UP: 87,
            DOWN: 83,
            LEFT: 65,
            RIGHT: 68
        };
        this.pos = {
            x: pos.x,
            y: pos.y
        };
        this.velocity = {
            limit: 6,
            x: 0,
            y: 0
        };
        this.acceleration = {
            limit: 1,
            x: 0,
            y: 0
        };
    }

    /**
     * Private function to check if the object is colliding with the enviroment.
     * Modifies the velocity so that it only reaches the collision but cant go through or into the collision
     */
    _ConstrainWithinEnviroment() {
        let posWithVelocity = {
            x: this.pos.x + this.velocity.x,
            y: this.pos.y + this.velocity.y
        };
        for (let collision of staticCollisions) {
            if (posWithVelocity.x + this.size > collision.x && posWithVelocity.x < collision.x + collision.width &&
            posWithVelocity.y + this.size > collision.y && posWithVelocity.y < collision.y + collision.height) {
                let modifierX = 0, modifierY = 0;
                let collisionMidPoint = {
                    x: (collision.x + collision.x + collision.width) / 2,
                    y: (collision.y + collision.y + collision.height) / 2
                };
                let leftSideColliding = posWithVelocity.x < collision.x + collision.width && posWithVelocity.x + this.size > collision.x + collision.width;
                let rightSideColliding = posWithVelocity.x + this.size > collision.x && posWithVelocity.x < collision.x;
                let topColiding = posWithVelocity.y < collision.y + collision.height && posWithVelocity.y + this.size > collision.y + collision.height;
                let bottomColliding = posWithVelocity.y + this.size > collision.y && posWithVelocity.y + this.size > collision.y;

                if (leftSideColliding && !rightSideColliding && (topColiding || bottomColliding)) {
                    if (bottomColliding && !topColiding) {
                        if (this.velocity.x  < 0) {
                            this.velocity.x -= posWithVelocity.x - (collision.x + collision.width);
                        }
                    }else {
                        this.velocity.x -= posWithVelocity.x - (collision.x + collision.width);
                    }
                } else
                if (rightSideColliding && !leftSideColliding && (topColiding || bottomColliding)) {
                    if (bottomColliding && !topColiding) {
                        if (this.velocity.x > 0) {
                            this.velocity.x -= posWithVelocity.x + this.size - collision.x;                                                           
                        }
                    } else {
                        this.velocity.x -= posWithVelocity.x + this.size - collision.x;                                                           
                    }
                } else
                if (topColiding && bottomColliding && !(leftSideColliding || rightSideColliding)) {
                    this.velocity.y -= posWithVelocity.y - (collision.y + collision.height);                
                } else 
                if (bottomColliding && !topColiding && !(leftSideColliding || rightSideColliding)) {
                    this.velocity.y -= posWithVelocity.y + this.size - collision.y;                                          
                }
            }
        }
    }
    
    /**
     * Applyies all of the resisting forces on to the objects velocity.
     */
    _applyForces() {
        if (this.velocity.x > 0) {
            this.velocity.x -= this.friction;
        }else if (this.velocity.x < 0) {
            this.velocity.x += this.friction;
        }
        this.velocity.y += this.gravity;
    }

    /**
     * Adds the velocity in a said axis.
     * 
     * @param {String} axis         The velocity axis for the object
     * @param {Number} amount       The ammount that is to be added / reduced
     */
    _addToVelocity(axis, amount) {
        let velocityLimit = this.velocity.limit;
        if (Math.abs(this.velocity[axis] + amount) < velocityLimit) {
            this.velocity[axis] += amount;
        }else if (Math.abs(this.velocity[axis] < velocityLimit) && Math.abs(this.velocity[axis] + amount) > velocityLimit) {
            if (amount < 0) {
                this.velocity[axis] = -velocityLimit;
            } else {
                this.velocity[axis] = velocityLimit;
            }
        }
    }

    /**
     * Sets the position of the object depending on the velocity of the object.
     */
    _setPosition() {
        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;
    }

    /**
     * Handles the keyboard inputs and applies the velocity in the required directions
     */
    _handleKeyBoard() {
        let inc = 4;
        if (keyIsDown(this.CONTROLS.UP)) {
            this._addToVelocity("y", -inc);
        }
        if (keyIsDown(this.CONTROLS.DOWN)) {
            this._addToVelocity("y", inc);
        }
        if (keyIsDown(this.CONTROLS.RIGHT)) {
            this._addToVelocity("x", inc);                        
        }
        if (keyIsDown(this.CONTROLS.LEFT)) {
            this._addToVelocity("x", -inc);                                             
        }

        this._applyForces();
        this._ConstrainWithinEnviroment();
        this._setPosition();
    }

    /**
     * The condensed function that will handle the keyboard inputs, apply forces, constrain the object within the enviroment and
     * set the position of the object.
     * 
     */
    move() {

        this._handleKeyBoard();
        
        super.draw(this.pos.x, this.pos.y, this.size);
    }
}