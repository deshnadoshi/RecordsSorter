const fs = require('fs');



function process_input(){   

    let current_record = "";
    let records = []; 

    fs.readFile('records.txt', (err, data) =>{
        if (err){
            console.log("Please rename your input file to records.txt and re-run the program."); 
        } else {
            let file_data = data.toString(); 
            let if_record_end = false;
            let if_record_begin = false; 

            file_data.split(/\r?\n/).forEach(line =>  {

                if ((line.toLowerCase()).includes("begin:record")){
                    if_record_begin = true;  
                    if_record_end = false; 
                } 

                if ((if_record_begin == true) && (if_record_end == false)){ // if you haven't reached the end of the record, continue
                    current_record += line; 
                }
                
                if ((line.toLowerCase()).includes("end:record")){ 
                    records.push(current_record); // not adding to the array properly?
                    if_record_end = true; // the current record has ended 
                    if_record_begin = false; 
                    current_record = ""; 
                }
            });

            console.log(records); 
            
        } 
    }); 

     


} 

process_input(); 
