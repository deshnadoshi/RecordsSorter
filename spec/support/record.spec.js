const { process_input } = require('../../record');
const fs = require('fs');


describe ('File-Records Sorter', () => {
    // Test Case 1: A correctly formatted records file should be sorted correctly. 
    it ('should sort a correctly formatted records in ascending order based on time', async () => {
        const result = await process_input("test1.txt"); 
        expect(result).toBe(true); 

        const test1_actual = fs.readFileSync('./sorted_records.txt', 'utf-8');
        expect(test1_actual).toBe("BEGIN:RECORD\nIDENTIFIER:record2\nTIME:00001105T123454\nCOLOR:red\nEND:RECORD\nBEGIN:RECORD\nIDENTIFIER:record4\nTIME:19980413T113530\nCOLOR:orange\nEND:RECORD\nBEGIN:RECORD\nIDENTIFIER:record1\nTIME:20031105T152400\nUNITS:kg\nWEIGHT:112\nCOLOR:Blue\nEND:RECORD\nBEGIN:RECORD\nIDENTIFIER:record3\nTIME:20100127T092400\nCOLOR:cyan\nEND:RECORD"); 
    }); 

    // Test Case 2: Files with records missing required properties should not be sorted. 
    it ('should not sort a file missing required properties', async () => {
        const result = await process_input("test2.txt"); 
        expect(result).toBe(false); 
    }); 

    // Test Case 3: Files with records containing an unknown property should not be sorted. 
    it ('should not sort a file with an unknown property', async () => {
        const result = await process_input("test3.txt"); 
        expect(result).toBe(false); 
    });

    // Test Case 4: Files with records containing more than one property per line should not be sorted.
    it ('should not sort a file with more than one property per line', async () => {
        const result = await process_input("test4.txt"); 
        expect(result).toBe(false); 
    });    

    // Test Case 5: Files with records with any form of white space should not be sorted. 
    it ('should not sort a file with any form of white space', async () => {
        const result = await process_input("test5.txt"); 
        expect(result).toBe(false); 
    }); 

    // Test Case 6: Files with records are not case sensitive and should be sorted. 
    it ('should sort a file with text in uppercase, lowercase, or a mix', async () => {
        const result = await process_input("test6.txt"); 
        expect(result).toBe(true); 

        const test6_actual = fs.readFileSync('./sorted_records.txt', 'utf-8');
        expect(test6_actual).toBe("BEGIN:RECORD\nIDeNTIfIER:record2\nTIME:15640205T095459\nCOLoR:red\nEnd:RECOrd\nBeGIN:ReCORD\nIDENTIfieR:record3\ntiME:20000127T092400\nColoR:YeLlow\nWeIgHT:131\nUniTS:lb\nEND:REcORD\nBegiN:RECoRD\nIDENtIFIER:record1\nTImE:20031105T115859\nCOlOR:bLUE\nEND:RECoRD"); 

    }); 

    // Test Case 7: Files with records with non-unique identifiers should not be sorted. 
    it ('should not sort a file with non-unique identifiers', async () => {
        const result = await process_input("test7.txt"); 
        expect(result).toBe(false); 
    }); 

    // Test Case 8: Files with records with unacceptable color names should not be sorted. 
    it ('should not sort a file with unacceptable COLOR values', async () => {
        const result = await process_input("test8.txt"); 
        expect(result).toBe(false); 
    }); 

    // Test Case 9: Files with records with an invalid weight value should not be sorted.
    it ('should not sort a file with unacceptable WEIGHT values', async () => {
        const result = await process_input("test9.txt"); 
        expect(result).toBe(false); 
    });

    // Test Case 10: Files with records with unacceptable units values should not be sorted. 
    it ('should not sort a file with unacceptable UNITS values', async () => {
        const result = await process_input("test10.txt"); 
        expect(result).toBe(false); 
    });
    // Records with a weight w/o stuff, requirements testing

    // Test Case 11: Files with records without an IDENTIFIER and TIME property should not be sorted. 
    it ('should not sort a file without an IDENTIFIER and TIME property in each record', async () => {
        const result = await process_input("test11.txt"); 
        expect(result).toBe(false); 
    });

    // Test Case 12: Files with records without a WEIGHT property and with a UNITS property should not be sorted. 
    it ('should not sort a file without a WEIGHT property and with a UNITS property', async () => {
        const result = await process_input("test12.txt"); 
        expect(result).toBe(false); 
    });

})
