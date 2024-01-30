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

            /**
             * Reading data from the input file, records.txt
             */
            file_data.split(/\r?\n/).forEach(line =>  {

                if ((line.toLowerCase()).includes("begin:record")){
                    if_record_begin = true;  
                    if_record_end = false; 
                } 

                if ((if_record_begin == true) && (if_record_end == false)){ // if you haven't reached the end of the record, continue
                    current_record += (line + "\n"); 
                }
                
                if ((line.toLowerCase()).includes("end:record")){ 
                    records.push(current_record); // not adding to the array properly?
                    if_record_end = true; // the current record has ended 
                    if_record_begin = false; 
                    current_record = ""; 
                }
            });

            /**
             * Handling the contents of each record.   
             */
            for (let i = 0; i < records.length; i++){
                record_i = split_record(records[i]); // record_i is the array storing the individual lines of the current record
                console.log(record_i); 
            }

             
            
        } 
    }); 

     


} 

process_input(); 


function split_record(record){
    let record_contents = []; 

    record.split(/\r?\n/).forEach(line =>  {
        record_contents.push(line); 
    });

    record_contents.pop(); // Gets rid of the extra new line at the end of each record

    return record_contents; 
}

function check_requirements(record_array){
    // record_array contains all the lines in one of the records 
    let id_included = false;
    let time_included = false;
    let units_included = false; 
    let weight_included = false;
    let color_included = false; 

    let id_count = 0; 
    let time_count = 0; 
    let units_count = 0; 
    let weight_count = 0; 
    let color_count = 0; 

    let valid_record = true;
    
    

    
    return valid_record; 

}