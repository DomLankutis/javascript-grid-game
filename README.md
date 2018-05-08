# Javascript Grid Game

A small project where the user provides the sprites and the map of the game

# How to use

To use this please make sure that you have the order of the scripts done correctly as otherwise the code will break. **Please look at the ```index.html``` file.**

```HTML
<html>
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.0/p5.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

    <script src="lib/p5.play.js"></script>

    <script src="./core/loadFile.js"></script>    
    <script src="./core/generateMap.js"></script>
    <script src="core/sprite.js"></script>  
    <script src="main.js"></script>
  </head>
  <body style="background: grey">
    <p>Upload sprites for map: <input type="file" id="sprites" multiple onchange="readImageFiles('sprites')"/></p>
    <p>Upload map of game: <input type="file" id="map" onchange="readTextFile('map')" accept=".txt"/></p>
    <output id="list"></output>
  </body>
</html>
```

If you want to change the input id's ensure to change the id's for the ```onchange``` function.

## Loading the images

To load the images you need to ensure that they are in a ```.png``` file format and that they are named with only a ***single character**, this is so that the map file is able to know which sprites you are talking about.

The player sprite should **always** be renamed to ```p.png```. As the player has been hard coded in the generation. [If you want to you can change this yourself]

## Setting up the Map and loading it

To load the map ensure that the map has a new line which is empty at the bottom of the whole map.

To set the layout of the map use the images single character name as an indicator of what you want to be placed in that location.
Ensure that the player is placed somewhere within the map or the application will crash.

### Debug

To view all of the collisions that have been generated call the function:

``` JAVASCRIPT
debug([PlayerObject])
```