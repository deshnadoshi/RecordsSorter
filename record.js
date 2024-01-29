const fs = require('fs');

let records = []; 
let begin_keyword = "record:begin"; 
let end_keyword = "record:end"; 
let current_record = "";

function process_input(){   

    fs.readFile('input.txt', (err, data) =>{
        if (err){
            console.log("Please rename your file to input.txt and re-run the program."); 
        } else {
            let file_data = data.toString(); 
            
            file_data.split(/\r?\n/).forEach(line =>  {
                let if_record_end = false;
                let if_record_begin = false; 
                 // the record currently being read and stored in a file
                // console.log("here1"); 

                if ((line.toLowerCase()).localeCompare(begin_keyword) == 0){
                    if_record_begin = true;  
                } 

                if ((if_record_begin== true) && (if_record_end == false)){ // if you haven't reached the end of the record, continue
                    console.log("here4"); 
                    console.log(line); 
                    current_record += line; 
                }
                
                if ((line.toLowerCase()).localeCompare(end_keyword) == 0){
                    console.log("here3"); 
                    current_record += line; 
                    console.log("THE RECORD::: ", current_record); 
                    records.push(current_record); 
                    if_record_end = true; // the current record has ended 
                    current_record = ""; 
                }
                
            });
            

        } 
    }); 

} 

process_input(); 
console.log("Records:", records); 
