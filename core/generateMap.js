let map = [[]],
    staticCollisions = [],
    player;
/**
 * Generates a sprites object with all the wanted sprites for the map.
 * Sprites should be named appropriately and all have a consistent size (remember this is for a grid map)
 * before using the loadSprites function.
 * 
 * @param {Number} SIZE         The size that all the sprites should be (will be resized anyway)
 * 
 * @returns                     Object with all the sprites and their file names
 */
function loadSprites(SIZE) {
    let sprites = new SpriteSheet();
    for (let imageName in images) {
        tint(255,255);
        sprites.addToSheet(imageName ,images[imageName], SIZE);
    }
    return sprites;
}

/**
 * Takes in a 2D array and returns all the values in a 1D array
 * 
 * @param {Array} arr           2D array that is to be taken in
 * 
 * @returns                     New array that is now 1D with all the information of the 2D array
 */
function normaliseArray(arr) {
    let newArr = [];
    for (let row of arr) {
        for (let obj of row) {
            newArr.push(obj);
        }
    }
    return newArr;
}

/**
 * Checks for all of the objects that can be merged vertically, and then merges them. 
 * 
 * 
 * @param {Array} map           The 2D array that you want to check the vertical check for
 * @param {Number} size         The size of all the objects (This is a grid game where all of the static sprites will have the same size)
 * 
 * @returns                     An array where all of the vertical shapes have been merged to the biggest shape vertically.
 */
function staticCollisionsVerticalCheck(map, size) {
    let newArr = [];
    let exists = new Set();
    for (let y = 0; y < map.length; y++) {
        // For every object in y compare it with every object in y + 1, loop this until there are no modifications then return
        newArr.push([]);
        for (let x = 0; x < map[y].length; x++) {
            let obj = map[y][x];
            let obj1 = map[y][x];
            let tempY = y + 1;
            let height = size;        
            while (obj.x == obj1.x && obj.width == obj1.width && tempY < map.length) {
                obj = obj1;
                for (let ob1 of map[tempY]) {
                    if (obj.x == ob1.x && obj.width == ob1.width && obj.y + size == ob1.y){
                        height += size;
                        obj1 = ob1;
                    }
                }
            tempY++;                    
            }
            let checkObject = [obj1.x, obj1.y + size].toString();
            if (!exists.has(checkObject)) {
                newArr[y].push({
                    x: obj1.x,
                    y: obj1.y - height +size,
                    height: height,
                    width: obj.width,
                    size: size
                });
                exists.add(checkObject);
            }
            
        }
    }
    return newArr;
}

/**
 * Generates all the static collisions for the map, by creating the biggest rectangles possible
 * as to reduce the iteration count when checking if a collision has occurred
 * 
 * @param {Array} map           The Map of the static collisions
 * 
 * @returns                     A new map that has all of shapes merged to the biggest size horizontally. This then gets checked vertically and normalised.
 */
function generateStaticCollisions(map) {
    let arr = [];
    let size = map[0][0].size;                                                                                      // Size is constant so all elements in the map will have the same size
    for (let y = 0; y < map.length; y++) {                                                                          // Iterate through all of the rows
        let width = size;                                                                                           // Set the initial width to the static size
        arr.push([]);
        if (map[y].length == 1) {                                                                                   // If there is only one object in a row
            let obj = map[y][0];                                                                                    // Set a variable for the object (makes it easier to type out the next line)
            arr[y].push({x: obj.x, y: obj.y, width: size, height: size, size: size});                               // push it as a single rectangle
        }
        for (let x = 0; x < map[y].length - 1; x++) {                                                               // Iterate through all the objects in each row (Horizontal Check) (except if there is only one in a row)
            let obj = map[y][x];                                                                                    // Set the first object
            let obj1 = map[y][x + 1];                                                                               // Set the second object
            if (obj.x + size == obj1.x) {                                                                           // If the first objects right wall touches the second objects left wall
                width += size;                                                                                      // Extend Width
            }else {                                                                                                 // Otherwise we can assume that the walls no longer touch
                arr[y].push({x: obj.x - width + size,y: y * size,width: width,height: size, size: size});           // Push the final [x, y, width, height] positions (Information will be used for collisions and can be used to draw said collision map)
                width = size;                                                                                       // Reset the width
            }               
            if (x + 1  == map[y].length - 1 && obj.x + size != obj1.x) {                                            // If its the last object and there is nothing behind it
                arr[y].push({x: obj1.x,y: y * size, width: size, height: size, size: size});                        // push it as a single rectangle
            }
            if (x + 1 == map[y].length - 1 && obj.x + size == obj1.x) {                                             // If its the last object and there is something behind it
                arr[y].push({x: obj.x - width + size * 2, y: y * size, width: width, height: size, size: size});    // Push it as a extended rectangle
            }
        }
    }
    return normaliseArray(staticCollisionsVerticalCheck(arr, size));                                                // Return the static collision array after parsing it vertically and normalising it to a 1D array
}

/**
 * Generates the map of the game from the text file provided.
 * This will also generate all the collisions and add a player object if there is one in the file (player will allways be "p")
 * 
 * @param {Array} SpriteSheet               The sprite sheet that has been loaded from the loadfile.js readImageFiles() function
 * @requires readImageFiles                 This function has to be run prior to this function
 */
function generateMap(SpriteSheet) {
    let y = 0, j = -1;
    let sprites = spriteSheet.sprites;
    let size = spriteSheet.size;
    for (let i = 0; i < textFile.length - 1; i++){
        j++;      
        let char = textFile.charAt(i);
        if (char == "0"){continue;}
        if (char == "\n") {
            y += 1;
            j = -1;                
            map.push([]);
            continue;
        }
        if (char != null && char != "p") {
            map[y].push({sprite: sprites[char], x: j * size, y: y * size, size: size});
        }else{
            player = new Player(images[char], size, {x: j * size, y: y * size});
        }
    }
    staticCollisions = generateStaticCollisions(map);
}

/**
 * Draws the Map after it has been generated.
 */
function drawMap() {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            let m = map[y][x];
            if (m.sprite.sprite != undefined) {
                image(m.sprite.sprite, m.x, m.y, m.size, m.size);
            }
        }
    }
}