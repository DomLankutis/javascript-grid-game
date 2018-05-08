let textFile,
    images = {},
    textFileStatus,
    imageFileStatus;

/**
 * Takes in a file from HTML (using "onchange" to call the function).
 * For example to do this in the <input> do onchange="readTextFile('[NAME_OF_ID]')"
 * Will load the text file onto the textFile variable.
 * 
 * @param {File} id             The HTML ID which is goingt be used for getting the element [This function should be called in the HTML file]
 * @returns                     The sate of attempting to read the file [1] Success, [-1] Failure. If its successful it will also modify the variable file
 *                              which can also be used to check if the function succeeded. 
 */
function readTextFile(id) {
    // Check if browser supports the File API
    if (window.File && window.FileReader && window.FileList && window.Blob){
        let inputFile = document.getElementById(id).files[0];
        let reader = new FileReader();
        reader.onload = () => {
            textFile = event.target.result;
            textFileStatus = 1;
        };
        reader.readAsText(inputFile);
    } else {
        alert("File API is not supported on this browser please use a differnet browser.");
    }
    textFileStatus = -1;    
}

/**
 * Takes in multiple files (using "onchange" to call the function).
 * For example to do this in the <input> do onchange="readImageFiles('[NAME_OF_ID]')"
 * Will load all the images onto an images object where the file name without the extension is the identifier for the image.
 * 
 * @param {File} id             The HTML ID which is going to be used for getting the element [This function should be called in the HTML file]
 * @returns                     The sate of attempting to read the file [1] Success, [-1] Failure. If its successful it will also modify the variable file
 *                              which can also be used to check if the function succeeded. 
 */
function readImageFiles(id) {
    if (window.File && window.FileReader && window.FileList && window.Blob){
        let inputFiles = document.getElementById(id).files;
        for (textFile of inputFiles){
            // Ensure files are images
            if (!textFile.type.match('image.*')) {
                alert("Ensure the images are .jpg, .png, .tff, etc...");
                continue;
            }
            let reader = new FileReader();
            reader.onload = ((thisFile) => {
                return e =>{
                    images[thisFile.name[0]] = loadImage(event.target.result);
                    imageFileStatus = 1;
                };
            })(textFile);
            reader.readAsDataURL(textFile);
        }
    } else {
        alert("File API is not supported on this browser please use a differnet browser.");
    }
    imageFileStatus = -1;    
}