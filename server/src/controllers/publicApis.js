const client = require('../database/connection');
const axios = require('axios');

// Define API endpoint for fetching data
const publicApi = async (req, res) => {
    try {
        const { category, limit } = req.query;
        const apiUrl = 'https://api.publicapis.org/entries';

        // Construct query parameters for filtering
        const queryParams = {};
        if (category) queryParams.category = category;
        if (limit) queryParams.limit = limit;

        // Make request to the public API with filtering options
        const response = await axios.get(apiUrl, { params: queryParams });
        const data = response.data;

        // Return the filtered data as JSON response
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data from public API' });
    }
};

module.exports = {
    publicApi
}