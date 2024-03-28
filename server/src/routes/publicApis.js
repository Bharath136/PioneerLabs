const express = require('express');
const { authenticateToken } = require('../middlewares/middleware');
const router = express.Router();

const {
    publicApi
} = require('../controllers/publicApis');

// Register a new user API
router.get('/public-apis', authenticateToken, publicApi);


module.exports = router;