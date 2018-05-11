class SpriteSheet {
    constructor() {
        this.sprites = {};
        this.size;
    }

    /**
     * Adds a single sprite to the grouped spritesheet. Where all the sprites can be accessed.
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
     * Private function to check if the object is colliding with the environment.
     * Modifies the velocity so that it only reaches the collision but cant go through or into the collision
     */
    _ConstrainWithinEnvironment() {
        let positionAfterVelocity = {
            x: this.pos.x + this.velocity.x,
            y: this.pos.y + this.velocity.y
        };
        let verticalCollisionHasBeenDone
        for (let collision of staticCollisions) {
            
            let collisionRight = collision.x + collision.width;
            let collisionLeft = collision.x;
            let collisionTop = collision.y;
            let collisionBottom = collision.y + collision.height;

            let playerRight = positionAfterVelocity.x + this.size;
            let playerLeft = positionAfterVelocity.x;
            let playerTop = positionAfterVelocity.y;
            let playerBottom = positionAfterVelocity.y + this.size;
            collision.col = 0;
            if (playerRight > collisionLeft && playerLeft < collisionRight && playerBottom > collisionTop && playerTop < collisionBottom) {


                let leftSideColliding = playerLeft < collisionRight && collisionRight < playerRight;
                let rightSideColliding = playerRight > collisionLeft && collisionLeft > playerLeft;
                let topColliding = playerTop < collisionBottom && collisionBottom < playerBottom;
                let bottomColliding = playerBottom > collisionTop && collisionBottom > playerTop;

                if (topColliding && !bottomColliding && !(leftSideColliding || rightSideColliding) && !verticalCollisionHasBeenDone) {
                    this.velocity.y -= playerTop - (collisionBottom);
                }
                if (bottomColliding && !topColliding && !(leftSideColliding || rightSideColliding) && !verticalCollisionHasBeenDone) {
                    this.velocity.y -= playerBottom - collisionTop;
                }
                if (bottomColliding && topColliding && !(leftSideColliding || rightSideColliding) && !verticalCollisionHasBeenDone) {
                    this.velocity.y -= playerTop - collisionBottom;
                }

                if (verticalCollisionHasBeenDone) {
                    verticalCollisionHasBeenDone = false;
                }

                if (leftSideColliding && !rightSideColliding && (topColliding || bottomColliding)) {
                    if (bottomColliding && !topColliding) {
                        if (this.velocity.x  < 0) {
                            this.velocity.x -= playerLeft - (collisionRight);
                        }
                    } else {
                        this.velocity.x -= playerLeft - (collisionRight);
                        if (topColliding && bottomColliding) {
                            if (collisionTop < playerTop) {
                                if (this.velocity.y > 0) {
                                    let diff = playerTop - collisionTop;
                                    if (Math.abs(diff) === 1) {
                                        this.velocity.y -= diff
                                    }else {
                                        this.velocity.y -= (playerBottom)- (collisionBottom);
                                    }
                                } else if (this.velocity.y < 0) {
                                    this.velocity.y -= playerTop - collisionBottom;
                                    this.velocity.x = 0;
                                }
                            } else {
                                this.velocity.y -= playerTop - (collisionBottom);
                            }
                            verticalCollisionHasBeenDone = true;
                        }
                    }
                }

                if (rightSideColliding && !leftSideColliding && (topColliding || bottomColliding)) {
                    if (bottomColliding && !topColliding) {
                        if (this.velocity.x > 0) {
                            this.velocity.x -= playerRight - collisionLeft;
                        }
                    } else {
                        this.velocity.x -= playerRight - collisionLeft;
                        if ( topColliding && bottomColliding) {
                            if (collisionTop < playerTop) {
                                if (this.velocity.y > 0) {
                                    let diff = playerTop - collisionTop;
                                    if (Math.abs(diff) === 1) {
                                        this.velocity.y -= diff
                                    }else {
                                        this.velocity.y -= (playerBottom)- (collisionBottom);
                                    }
                                } else if (this.velocity.y < 0) {
                                    this.velocity.y -= playerTop - collisionBottom;
                                    this.velocity.x = 0;
                                }
                            } else {
                                this.velocity.y -= playerTop - (collisionBottom);
                            }
                            verticalCollisionHasBeenDone = true;
                        }
                    }
                }
                collision.col = 255;
            }
        }
    }
    
    /**
     * Applies all of the resisting forces on to the objects velocity.
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
     * @param {Number} amount       The amount that is to be added / reduced
     */
    _addToVelocity(axis, amount) {
        let velocityLimit = this.velocity.limit;
        if (Math.abs(this.velocity[axis] + amount) < velocityLimit) {
            this.velocity[axis] += amount;
        }else if (Math.abs(this.velocity[axis]) < velocityLimit && Math.abs(this.velocity[axis] + amount) > velocityLimit) {
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
        this._ConstrainWithinEnvironment();
        this._setPosition();
    }

    /**
     * The condensed function that will handle the keyboard inputs, apply forces, constrain the object within the environment and
     * set the position of the object.
     * 
     */
    move() {

        this._handleKeyBoard();
        
        super.draw(this.pos.x, this.pos.y, this.size);
    }
}