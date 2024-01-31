const { time, log } = require('console');
const fs = require('fs');

const allowable_colors = [
    "Red", "Green", "Blue", "Yellow", "Purple",
    "Cyan", "Magenta", "White", "Black", "Gray",
    "Silver", "Maroon", "Olive", "Navy", "Teal",
    "Lime", "Aqua", "Fuchsia", "Pink", "Brown"
  ];
  

function process_input(file_name_string){   

    let current_record = "";
    let records = []; 
    let check_records = []; 
    let is_record_err = false; 

    fs.readFile(file_name_string, (err, data) =>{
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

            // might have to get rid of this
             for (let i = 0; i < check_records.length; i++){
                if (check_records[i] == false){
                    is_record_err = true;  
                }
             }

             check_records = []; 

             for (let i = 0; i < records.length; i++){
                record_i = split_record(records[i]);
                check_records.push(check_valid_color(record_i)); 
            }
            
            for (let i = 0; i < check_records.length; i++){
                if (check_records[i] == false){  
                    is_record_err = true; 
                    // process.exit();  
                }
            }
            
        } 
    }); 

     


} const readline = require('node:readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

function get_file_name(){
    
    readline.question(`\n\nEnter the name of your text file with the extension included (i.e. records.txt) [Enter 'Q' to exit]: `, input_file_name => {
        fs.readdir('.', (err, files) => {
            if (err) {
              console.error(err);
              return;
            }

            if (input_file_name === "Q" || input_file_name === 'q'){
                process.exit(); 
            }

            if (files.includes(input_file_name)) {
                process_input(input_file_name);
                setTimeout(function() {
                    get_file_name(); 
                }, 10);
                  
            } else {
                console.log(`${input_file_name} does not exist in the current directory.`);
                console.log("Please enter a new file name."); 
                get_file_name(); 
            }
            
        });
         
    });
}

get_file_name(); 

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

function check_valid_color(record_array){
    let is_valid_color = true; 
    let color_line = "";
    let color_line_arr = []; 
    let color_value = ""; 
    let in_color_list = false; 
    
    // already assuming that the check for color has been done, so no need to check that color exists
    for (let i = 0; i < record_array.length; i++){
        if ((record_array[i].toLowerCase()).includes("color")){
            // store the line with color in it here
            color_line = record_array[i]; 
        }
    }
    // issue is that the line is empty so it sends out the other formatting messaee anyway 

    // if there is a colon, separate at colon, otherwise you know that there is a formatting issue 
    if (color_line.includes(":")){
        color_value_arr = color_line.split(":"); 
        if (color_value_arr.length > 2){
            // if there is more than one :, and it is split into more than 2 parts, theres a formatting issue
            is_valid_color = false; 
        } else {
            // if there are only two parts, take the second part and check that
            color_value = color_value_arr[color_value_arr.length - 1]; // this has the color value
            for (let i = 0; i < allowable_colors.length; i++){
                if (color_value.toLowerCase() === allowable_colors[i].toLowerCase()){
                    in_color_list = true; 
                }
            }

            is_valid_color = in_color_list; // if it is in the color list, it is valid, otherwise it is not
            if (in_color_list == false){
                console.log("There is invalid COLOR in one (or more) of your records. "); 
            }
        }
    } else {
        if (!(color_line === ""))
            console.log("There is a formatting issue in one (or more) of your records. ");
        is_valid_color = false; 
    }

    return is_valid_color; 
}
// UNFINISHED
function check_valid_units(record_array){
    let units_line = ""; 
    let is_valid_units = true; 
    let units_value_arr = []; 


    for (let i = 0; i < record_array.length; i++){
        if ((record_array[i].toLowerCase()).includes("units")){
            // store the line with units label in it here
            units_line = record_array[i]; 
        }
    }


    if (units_line.includes(":")){
        units_value_arr = units_line.split(":"); 
        if (units_value_arr.length > 2){
            // if there is more than one :, and it is split into more than 2 parts, theres a formatting issue
            is_valid_color = false; 
        } else {
            // if there are only two parts, take the second part and check that
            color_value = color_value_arr[color_value_arr.length - 1]; // this has the color value
            for (let i = 0; i < allowable_colors.length; i++){
                if (color_value.toLowerCase() === allowable_colors[i].toLowerCase()){
                    in_color_list = true; 
                }
            }

            is_valid_color = in_color_list; // if it is in the color list, it is valid, otherwise it is not
            if (in_color_list == false){
                console.log("There is invalid COLOR in one (or more) of your records. "); 
            }
        }
    } else {
        if (!(color_line === ""))
            console.log("There is a formatting issue in one (or more) of your records. ");
        is_valid_color = false; 
    }


    return is_valid_units; 



}