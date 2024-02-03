const { process_input } = require('../../record');

describe ('File-Records Sorter', () => {
    // Test Case 1: A correctly formatted records file should be sorted.
    it ('should sort a correctly formatted records in ascending order based on time', async () => {
        const result = await process_input("test1.txt"); 
        expect(result).toBe(true); 
    }); 

    // Test Case 2: Files missing required properties should not be sorted. 
    it ('should not sort a file missing required properties', async () => {
        const result = await process_input("test2.txt"); 
        expect(result).toBe(false); 
    }); 

    // Test Case 3: Files containing an unknown property should not be sorted. 
    it ('should not sort a file with an unknown property', async () => {
        const result = await process_input("test3.txt"); 
        expect(result).toBe(false); 
    });

    // Test Case 4: Files containing more than one property per line should not be sorted.
    it ('should not sort a file with more than one property per line', async () => {
        const result = await process_input("test4.txt"); 
        expect(result).toBe(false); 
    });    
        

})
