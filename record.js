const { time, log } = require('console');
const fs = require('fs');

const allowable_colors = [
    "Red", "Green", "Blue", "Yellow", "Purple",
    "Cyan", "Magenta", "White", "Black", "Gray",
    "Silver", "Maroon", "Olive", "Navy", "Teal",
    "Lime", "Aqua", "Fuchsia", "Pink", "Brown"
  ];
  

const allowable_units = ["mg", "g", "kg", "oz", "lb", "ton"];

function process_input(file_name_string){   

    let current_record = "";
    let records = []; 
    let check_records = []; 
    let is_req_err = false; 
    let is_color_err = false; 
    let is_weight_err = false;
    let is_units_err = false;
    let is_unique_id_corr = false; 
    let is_time_format_corr = false; 

    fs.readFile(file_name_string, (err, data) =>{
        if (err){
            console.log("Please try again."); 
        } else {
            let file_data = data.toString(); 
            let if_record_end = false;
            let if_record_begin = false; 
            let if_whitespace = false; 

            let lines = file_data.split('\n');
            let contains_whitespace = lines.some(line => /^\s*$/.test(line));
            if (contains_whitespace){
                console.log("There is white-space in your file. Please delete it."); 
            }

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
                    is_req_err = true;  
                }
             }

             check_records = []; 

             for (let i = 0; i < records.length; i++){
                record_i = split_record(records[i]);
                check_records.push(check_valid_color(record_i)); 
            }
            
            for (let i = 0; i < check_records.length; i++){
                if (check_records[i] == false){  
                    is_color_err = true; 
                }
            }

            check_records = [];

            for (let i = 0; i < records.length; i++){
                record_i = split_record(records[i]);
                check_records.push(check_valid_units(record_i)); 
            }
            
            for (let i = 0; i < check_records.length; i++){
                if (check_records[i] == false){  
                    is_units_err = true; 
                    // process.exit();  
                }
            }

            check_records = [];

            for (let i = 0; i < records.length; i++){
                record_i = split_record(records[i]);
                check_records.push(check_valid_weight(record_i)); 
            }
            
            for (let i = 0; i < check_records.length; i++){
                if (check_records[i] == false){  
                    is_weight_err = true; 
                    // process.exit();  
                }
            }

            is_unique_id_corr = check_valid_id(records); 
            
            is_time_format_corr = check_valid_time(records); 

            if (is_req_err == false && is_color_err == false && is_units_err == false && is_weight_err == false && is_unique_id_corr == true && is_time_format_corr == true && contains_whitespace == false){
                let sorted_arr = []; 
                console.log("Your records file contains NO errors!"); 
                console.log("The results of the sorted records are stored in the 'sorted_records.txt' file in your file directory."); 

                date_conversion("20031105T152300"); // obviously need to change this
                sorted_arr = sort_times(records); // sorted_arr has the sorted contents
                
                let output_records = sorted_arr.join(''); 
                // console.log(output_records); 
                // now need to export these contents to a file 

                fs.writeFile('sorted_records.txt', output_records, (err) => {
                    if (err) {
                      console.error('Error writing to file:', err);
                    } else {
                      console.log('File written successfully.');
                    }
                  });
                  

                return "Success"; 

            } else {
                console.log("\n\n--YOU HAVE THE AFOREMENTIONED ISSUES IN YOUR RECORDS FILE. PLEASE EDIT THE FILE AND TRY AGAIN.--"); 
                return "Failure"; 
            }
            
        } 
    }); 

     


} 
const readline = require('node:readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

function get_file_name(){
    
    readline.question(`\n\nEnter the name of your text file with the extension included (i.e. records.txt) [enter 'Q' to exit]\nPlease Note >> Input files are sensitive to whitespace, however they are not case sensitive: `, input_file_name => {
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
                }, 20);
                  
            } else {
                console.log(`${input_file_name} does not exist in the current directory. Please enter a new file name.`);
                get_file_name(); 
            }
            
        });
         
    });
}



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

    if ((weight_count == 1 && units_count != 1) || (weight_count == 0 && units_count != 0)){
        console.log("There is an error in your records file. UNITS property is only required when WEIGHT is provided."); 
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
            console.log("Please check your file for a formatting issue under COLOR."); 
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

function check_valid_units(record_array){
    let units_line = ""; 
    let is_valid_units = true; 
    let units_value_arr = []; 
    let units_value = ""; 
    let in_units_list = false; 


    for (let i = 0; i < record_array.length; i++){
        if ((record_array[i].toLowerCase()).includes("units")){
            // store the line with units label in it here
            units_line = record_array[i]; 
        }
    }


    if (units_line.includes(":")){
        units_value_arr = units_line.split(":"); 
        if (units_value_arr.length > 2 || units_value_arr.length < 1){
            // if there is more than one :, and it is split into more than 2 parts, theres a formatting issue
            console.log("Please check your file for a formatting issue under UNITS."); 
            is_valid_units = false; 
        } else {
            // if there are only two parts, take the second part and check that
            units_value = units_value_arr[1]; // this has the color value
            for (let i = 0; i < allowable_units.length; i++){
                if (units_value.toLowerCase() === allowable_units[i].toLowerCase()){
                    in_units_list = true; 
                }
            }

            is_valid_units = in_units_list; // if it is in the color list, it is valid, otherwise it is not
            if (in_units_list == false){
                console.log("There is invalid UNITS in one (or more) of your records. "); 
            }
        }
    } else {
        if (!(units_line === "")){
            console.log("There is a formatting issue in one (or more) of your records. ");
            is_valid_units = false; 
            // this is included bc some records don't have an input line so it just checks the files that do have on

        }
            
    }


    return is_valid_units; 



}

function check_valid_weight(record_array){
    let weight_line = ""; 
    let is_valid_weight = true; 
    let weight_value_arr = []; 
    let weight_value = ""; 
    let in_weight_list = false; 


    for (let i = 0; i < record_array.length; i++){
        if ((record_array[i].toLowerCase()).includes("weight")){
            // store the line with units label in it here
            weight_line = record_array[i]; 
        }
    }


    if (weight_line.includes(":")){
        weight_value_arr = weight_line.split(":"); 
        if (weight_value_arr.length > 2){
            // if there is more than one :, and it is split into more than 2 parts, theres a formatting issue
            console.log("Please check your file for a formatting issue under WEIGHT."); 
            is_valid_weight = false; 
        } else {
            // if there are only two parts, take the second part and check that
            weight_value = weight_value_arr[weight_value_arr.length - 1]; // this has the color value
            if (/^\d+$/.test(weight_value)){
                in_weight_list = true; 
            }

            is_valid_weight = in_weight_list; // if it is in the color list, it is valid, otherwise it is not
            if (in_weight_list == false){
                console.log("There is invalid WEIGHT in one (or more) of your records. "); 
            }
        }
    } else {
        if (!(weight_line === "")){
            console.log("There is a formatting issue in one (or more) of your records. ");
            is_valid_weight = false; 
        }
        
    }


    return is_valid_weight; 
}

function check_valid_id(all_records_array){
    let all_unique = true; 
    let id_array = []; 
    // let individual_line = []; 
    // all_records_array is the records array in the original function 

    // need to get the identifier line from each records array 
    for (let i = 0; i < all_records_array.length; i++){
        record_i = split_record(all_records_array[i]); 
        for (let j = 0; j < record_i.length; j++){
            if ((record_i[j].toLowerCase()).includes("identifier")){
                id_array.push(record_i[j]); 
            }
        }
    }

    // now id_array has all of the identifier lines, just need to compare if they are the same 
    for (let i = 0; i < id_array.length; i++) {
        for (let j = i + 1; j < id_array.length; j++) {
            if (id_array[i].toLowerCase() === id_array[j].toLowerCase()) {
                all_unique = false; 
            }
        }
    }

    if (all_unique == false){
        console.log("One (or more) IDENTIFIER is not unique."); 
    }

    // console.log(id_array);  // need to delete or comment this out later on
    return all_unique; 
}

function check_valid_time(all_records_array){

    let time_str_array = []; 
    let time_arr = []; 
    let is_time_valid = true; 
    let is_format_correct = []; 
    let is_date_nums_valid = []; 

    for (let i = 0; i < all_records_array.length; i++){
        record_i = split_record(all_records_array[i]); 
        for (let j = 0; j < record_i.length; j++){
            if ((record_i[j].toLowerCase()).includes("time")){
                time_str_array.push(record_i[j]); 
            }
        }
    }

    for (let i = 0; i < time_str_array.length; i++){
        if (time_str_array[i].includes(":")){
            let time_val = []; 
            time_val = time_str_array[i].split(":"); 
            if (time_val.length > 2 || time_val.length < 1){
                console.log("One (or more) of your TIME values are not in the correct format."); 
                is_time_valid = false; 
                break; 
            } else {
                time_arr.push(time_val[1]); 
            }
        } else {
            is_time_valid = false; 
            console.log("One (or more) of your TIME properties are incorrectly formatted."); 
            break; 
        }
        
    }

    if (time_str_array.length == time_arr.length){
        // if their lengths arent the same it means tht some of the times were invalid
        // if their lengths ARE the same it means that all the entries are valid and so now i can check them for formatting
        // console.log(time_arr); 

        for (let i = 0; i < time_arr.length; i++){
            is_format_correct.push(check_input_date(time_arr[i])); 
        }

        for (let i = 0; i < is_format_correct.length; i++){
            if (is_format_correct[i] == false){
                is_time_valid = false; 
                console.log("One (or more) of your TIME values are incorrectly formatted.");  
            }
        }

        if (is_time_valid == true){
            // so there are no issues with format thus far
            for (let i = 0; i < time_arr.length; i++){
                is_date_nums_valid.push(check_valid_date(time_arr[i])); 
            }
            
            for (let i = 0; i < is_date_nums_valid.length; i++){
                if (is_date_nums_valid[i] == false){
                    is_time_valid = false; 
                    console.log("One (or more) of your TIME values are invalid."); 
                }
            }
        }

    }

    return is_time_valid; 

}

function sort_times(all_records_array){
    // take the entire array and store all the time values with the id 1 stuff in another array 
    // use date_conversion to get the string 
    // then sort using the min/max method for normal numbers 

    let time_str_array = [];
    let time_arr = []; 

    for (let i = 0; i < all_records_array.length; i++){
        record_i = split_record(all_records_array[i]); 
        for (let j = 0; j < record_i.length; j++){
            if ((record_i[j].toLowerCase()).includes("time")){
                time_str_array.push(record_i[j]); 
            }
        }
    }

    for (let i = 0; i < time_str_array.length; i++){
        if (time_str_array[i].includes(":")){
            let time_val = []; 
            time_val = time_str_array[i].split(":"); 
            if (time_val.length > 2 || time_val.length < 1){
                is_time_valid = false; 
                break; 
            } else {
                time_arr.push(time_val[1]); 
            }
        }
    }

    let date_obj_arr = []; 
    // time_arr has all of the dates and times 
    for (let i = 0; i < time_arr.length; i++){
        date_obj_arr.push({key: (i), value: date_conversion(time_arr[i])}); 
    }

    // console.log(date_obj_arr); // can delete this later
    date_obj_arr.sort((a, b) => a.value - b.value);

    // now store the order of the keys in another array
    // then rearrange the records array into this order 

    let date_order = []; 

    for (let i = 0; i < time_arr.length; i++){
        date_order.push(date_obj_arr[i].key); 
    }

    let sorted_records_arr = []; 
    // console.log(date_order); // delete later
    sorted_records_arr = date_order.map(index => all_records_array[index]);

    return sorted_records_arr; 



}

/**
 * Determines if the chosen date and time is valid. 
 * Checks for maximum and minimum possible values of each field. 
 * @param {} check_date The date inputted by the user. 
 * @returns True if the date is valid, false otherwise. 
 */
function check_valid_date(check_date){
    is_valid_date = true; // Assuming the format is valid, we can split up the date
    
    let year = parseInt(date_split(check_date).year);
    let month = parseInt(date_split(check_date).month);
    let day = parseInt(date_split(check_date).day);
    let hour = parseInt(date_split(check_date).hour);
    let min = parseInt(date_split(check_date).min);
    let sec = parseInt(date_split(check_date).sec); 


    // Check for month and day. 
    if (month > 12 || month < 1){
        console.log("The month is invalid."); 
        is_valid_date = false; 
    }

    if (day > 31 || day < 1){ 
        console.log("The day is invalid."); 
        is_valid_date = false; // Basic check for date range (need to implement check for specific days)
    }


    if (match_month(year, month, day) == false){
        console.log("The number of days does not match the month or year."); 
        // Checks if the month matches the month
        is_valid_date = false; 
    }

    if (hour > 23 || hour < 0){
        console.log("The hours are invalid."); 
        is_valid_date = false; 
    }

    if (min > 59 || min < 0){
        console.log("The minutes are invalid."); 
        is_valid_date = false; 
    }

    if (sec > 59 || sec < 0){
        console.log("The seconds are invalid."); 
        is_valid_date = false; 
    }
    
    return is_valid_date; 

}

/**
 * Determines if the number of days matches the month. 
 * For example, if the month is January, the maximum number of days it can have is 31. 
 * @param {*} year_num The value of the year. 
 * @param {*} month_num The value of the monht. 
 * @param {*} days_num The value of the day. 
 * @returns 
 */
function match_month(year_num, month_num, days_num){
    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12){
        if (days_num > 31 || days_num <= 0){
            return false; 
        }
    } else if (month == 4 || month == 6 || month == 9 || month == 11){
        if (days_num > 30 || days_num <= 0){
            return false; 
        }
    } else if (month == 2){
        if (is_leap_year(year_num)){ // If February is a leap year, the days should be less than 29
            if (days_num > 29 || days_num < 0){
                return false; 
            }
        } else {
            if (days_num > 28 || days_num < 0){
                return false; 
            }
        }
    }

    return true; 
}

/**
 * Determines if a given year is a leap year. 
 * @param {} year_num The value of the year. 
 * @returns True if the given year is a leap year, false otherwise. 
 */
function is_leap_year (year_num){
    if (year_num % 4 == 0){
        if (year_num % 100 == 0){
            if (year_num % 400 == 0){
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    return false;
}

/**
 * Determines if the entered date is of the correct format. 
 * @param {*} check_date The date entered by the user.  
 * @returns True if the date is valid, false otherwise. 
 */
function check_input_date(check_date){
    matched = false; 
    // YYYY MM DD T HH MM SS
    let date_regex = /[0-9][0-9][0-9][0-9][0-1][0-9][0-2][0-9]T[0-2][0-9][0-5][0-9][0-5][0-9]/;
    if (date_regex.test(check_date)){
        matched = true; 
    }

    if (!matched){
        console.log("TIME values must follow the format: YYYYMMDDTHHMMSS."); 
    }

    return matched; 
}

//CAN MANIPULATE THIS TO CHANGE THE DATE IN A WAY THAT IS ORDERABLE
/**
 * Creating a Date object from the command line input. 
 */
function date_conversion(cmd_input){

    date_info = cmd_input.substring(0, 8); // All of the data before the 'T', represents the date
    time_info = cmd_input.substring(9); // All of the data after the 'T', represents the time

    year = date_info.substring(0, 4); 
    month = date_info.substring(4, 6); 
    day = date_info.substring(6); 

    hour = time_info.substring(0, 2); 
    min = time_info.substring(2, 4); 
    sec = time_info.substring(4);

    date_arg = year + "-" + month + "-" + day + "T" + hour + ":" + min + ":" + sec; 

    date_obj = new Date(date_arg);  
    // date_string = ""; 

    // month = find_month(date_obj.getMonth()); 
    // time_range = find_time_range(date_obj.getHours()); 
    // hour = calc_hour(date_obj.getHours()); 
    // min = calc_min(date_obj.getMinutes(), date_obj.getSeconds()); 
    // sec = calc_sec(date_obj.getSeconds()); 

    // date_string = month + " " + date_obj.getDate() + " " + date_obj.getFullYear() + " " + hour + min + sec + " " + time_range; 
    // console.log(date_string); 
    
    return date_obj; 
     
}

/**
 * Maps Date object's numbers to month string. 
 * @param {} num The value of the month in the Date object. 
 * @returns The full name of the month. 
 */
function find_month(num){
    switch (num){
        case 0:
            return "Jan"; 
            break; 
        case 1: 
            return "Feb"; 
            break; 
        case 2: 
            return "Mar"; 
            break; 
        case 3:
            return "Apr";
            break;
        case 4: 
            return "May";
            break; 
        case 5: 
            return "Jun"; 
            break; 
        case 6: 
            return "Jul"; 
            break; 
        case 7:
            return "Aug"; 
            break; 
        case 8:
            return "Sep";
            break;
        case 9: 
            return "Oct"; 
            break;
        case 10:
            return "Nov"; 
            break;
        case 11:
            return "Dec";
            break; 
        default:
            return "";
    }

}

/**
 * Maps Date object's numbers to AM/PM. 
 * @param {} num The value of the hour in the Date object. 
 * @returns AM/PM depending on the hour. 
 */
function find_time_range(num){
    if (num >= 12){
        return "PM"; 
    } 

    return "AM"; 
}

/**
 * Transforms 24 hour format to 12 hour format. 
 * @param {} num The value of the hour in the Date object.
 * @returns The 12 hour format time.
 */
function calc_hour(num){
    if (num < 12){
        return "0" + num; 
    }

    return num; 
}

/**
 * Formats the string for the minutes.
 * @param {} num The value of the minutes in the Date object.
 * @returns Formatted output for the minutes.
 */
function calc_min(num, seconds){
    if (num == 0){
        return ":0" + num; 
    }
    return ":" + num; 
}

/**
 * Formats the string for the seconds.
 * @param {} num The value of the seconds in the Date object.
 * @returns Formatted output for the seconds.
 */
function calc_sec(num){
    if (num == 0){
        return ":0" + num; 
    } 
    return ":" + num; 
}


/**
 * Splits the date apart into year, month, day, hour, minute, and second. 
 * @param {} cmd_input The date entered by the user. 
 * @returns The different components of the date (such as, year, month, etc.). 
 */
function date_split(cmd_input){
    date_info = cmd_input.substring(0, 8); // All of the data before the 'T', represents the date
    time_info = cmd_input.substring(9); // All of the data after the 'T', represents the time

    year = date_info.substring(0, 4); 
    month = date_info.substring(4, 6); 
    day = date_info.substring(6); 

    hour = time_info.substring(0, 2); 
    min = time_info.substring(2, 4); 
    sec = time_info.substring(4); 

    return {
        year: year,
        month: month,
        day: day,
        hour: hour,
        min: min,
        sec: sec
    };

}

get_file_name(); 