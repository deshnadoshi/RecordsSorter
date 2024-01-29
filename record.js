const fs = require('fs');

let records = []; 
let begin_keyword = "record:begin"; 
let end_keyword = "record:end"; 

function process_input(){   

    fs.readFile('input.txt', (err, data) =>{
        if (err){
            console.log("Please rename your file to input.txt and re-run the program."); 
        } else {
            let file_data = data.toString(); 
            
            file_data.split(/\r?\n/).forEach(line =>  {
                let if_record_end = false;
                let current_record = ""; // the record currently being read and stored in a file
                console.log("here1"); 
                if ((line.toLowerCase()).localeCompare(begin_keyword) == 0){
                    console.log("here2"); 
                    if (if_record_end == false){ // if you haven't reached the end of the record, continue
                        console.log("here4"); 
                        current_record += line; 
                    }
                    // never goes into this if statement, bc checking for end is inside checking for begin
                    if ((line.toLowerCase()).localeCompare(end_keyword) == 0){
                        console.log("here3"); 
                        current_record += line; 
                        console.log("the record", current_record); 
                        records.push(current_record); 
                        if_record_end = true; // the current record has ended 
                    }

                }
                
            });
            

        } 
    }); 

} 

process_input(); 
console.log("hello", records); 