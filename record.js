const { time, log } = require('console');
const fs = require('fs');

const allowable_colors = [
    "Red", "Green", "Blue", "Yellow", "Purple",
    "Cyan", "Magenta", "White", "Black", "Gray",
    "Silver", "Maroon", "Olive", "Navy", "Teal",
    "Lime", "Aqua", "Fuchsia", "Pink", "Brown"
  ];
  
let log_message = ""; 

function process_input(){   

    let current_record = "";
    let records = []; 
    let check_records = []; 
    let is_record_err = false; 

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
                check_records.push(check_requirements(record_i)); 
            }

             for (let i = 0; i < check_records.length; i++){
                if (check_records[i] == false){
                    console.log(log_message); 
                    console.log("Please check record", (i + 1)); 
                    is_record_err = true; 
                }
             }

             if (is_record_err){
                process.exit(); 
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
    let unknown_count = 0; 

    let valid_record = true;
    

    for (let i = 0; i < record_array.length; i++){
        if ((record_array[i].toLowerCase()).includes("identifier")){
            id_count++; 
        } else if ((record_array[i].toLowerCase()).includes("time")){
            time_count++; 
        } else if ((record_array[i].toLowerCase()).includes("units")){
            units_count++; 
        } else if ((record_array[i].toLowerCase()).includes("weight")){
            weight_count++; 
        } else if ((record_array[i].toLowerCase()).includes("color")){
            color_count++; 
        } else if (!((record_array[i].toLowerCase()).includes("begin") || (record_array[i].toLowerCase()).includes("end"))){
            // if the record doesn't have begin and end, and it also doesn't have any of the other properties
            // then there is an unknown property 
            unknown_count++; 
        }

    }

    if (id_count != 1){
        console.log("There is an error in your records file. You may only have one IDENTIFIER property."); 
        valid_record = false; 
    }

    if (time_count != 1){
        console.log("There is an error in your records file. You may only have one TIME property."); 
        valid_record = false; 
    }

    if (units_count > 1){
        console.log("There is an error in your records file. You may only have one UNITS property."); 
        valid_record = false; 
    }

    if (weight_count > 1){
        console.log("There is an error in your records file. You may only have one WEIGHT property."); 
        valid_record = false; 
    }

    if (color_count > 1){
        console.log("There is an error in your records file. You may only have one COLOR property."); 
        valid_record = false; 
    }

    if (weight_count == 1 && units_count != 1){
        console.log("There is an error in your records file. UNITS property is required when WEIGHT is provided."); 
        valid_record = false; 
    }

    if (unknown_count > 0){
        console.log("There is an error in your records file. There is an unknown property."); 
        valid_record = false; 
    }

    return valid_record; 

}