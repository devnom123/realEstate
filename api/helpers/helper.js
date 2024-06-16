// Function to parse query parameters
export function parseQueryParams(query) {
    const parsedQuery = {};
    for (const key in query) {
        let value = query[key];
        
        // Convert 'null' string to null
        if (value === 'null' || value === 'undefined') {
            value = null;
        }
        
        // Convert numeric strings to numbers
        else if (!isNaN(value) && value.trim() !== '') {
            value = Number(value);
        }

        parsedQuery[key] = value;
    }
    return parsedQuery;
}
