const { process_input } = require('../../record');

describe ('Records', () => {
    // Test Case 1: A correctly formatted records file should be sorted.
    it ('should sort a correctly formatted records in ascending order based on time', async () => {
        const result = await process_input("test2.txt"); 
        expect(result).toBe(true); 
    }); 

    // Test Case 2: 

})
