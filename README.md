# ECE452: Software Engineering Assignment 2
#### Deshna Doshi, dd1035
### Algorithm Design Description: 

1. Users must enter the name of the file (.txt extensions only) in the command line when prompted. Files must be in the same directory are the Assignment 2 Folder. Files not in this directory will not be recorgnized/processed. 

2. The program runs in a loop. Users will be asked to enter the file name continually after sorting, until they enter 'Q' or 'q'. 


4. The sorted outputs are stored in 'sorted_records.txt'. This file will be updated at each iteration of a new records file being sorted and processed (if there are no errors). 
 

#### Valid vs. Invalid File Constraints
1. Whitespace is not permitted in the files. Empty lines, tabs, or any other white space will report an error in the file. For example, 'WEIGHT   :112' will be considered invalid. 

2. Record properties and values are not case sensitive, besides the letter 'T' in the TIME property. 

3. Errors will be reported for the number of times that the error is present. For example, if the error **"There is invalid UNITS in one (or more) of your records."** shows up twice, it indicates that there are two records dealing with this error. 

4. File records will not be sorted as long as there are errors in the .txt files.

5. Permitted COLOR values are limited to the rainbow and other popular shades. The full list of acceptable colors is: "Red", "Green", "Blue", "Yellow", "Purple", "Cyan", "Magenta", "White", "Black", "Gray", "Silver", "Maroon", "Olive", "Navy", "Teal", "Lime", "Aqua", "Fuchsia", "Pink", "Brown", "Orange", "Violet", "Pink", "Indigo", "Gold", "Lavender", "Turqoise". 

6. Permitted UNITS values are limited to the following: "mg", "g", "kg", "oz", "lb", "ton". 

7. IDENTIFIER values must be unique and may be any combination of letters, symbols, and special characters.

8. The TIME property follows the same exact format as Assignment 1: YYYYMMDDTHHMMSS. 





