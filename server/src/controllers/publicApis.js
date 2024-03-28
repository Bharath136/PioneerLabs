const client = require('../database/connection');
const axios = require('axios');
const {Web3} = require('web3');

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

const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_API_KEY'); //Here i didn't get any free api key for if.

const ethereum = async (req, res) => {
    try {
        const balanceWei = await web3.eth.getBalance(req.params.address);
        const balanceEth = web3.utils.fromWei(balanceWei, 'ether');

        res.json({ balance: balanceEth });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching balance' });
    }
};

module.exports = {
    publicApi,
    ethereum
}