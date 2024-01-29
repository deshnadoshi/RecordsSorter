const fs = require('fs');

let records = []; 

fs.readFile('input.txt', (err, data) =>{
    if (err){
        console.log("Please rename your file to input.txt and re-run the program."); 
    } else {
        let file_data = data.toString(); 
    } 
}); 