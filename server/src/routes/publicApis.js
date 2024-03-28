const express = require('express');
const { authenticateToken } = require('../middlewares/middleware');
const router = express.Router();

const {
    publicApi, ethereum
} = require('../controllers/publicApis');


router.get('/public-apis', authenticateToken, publicApi);

router.get('/ethbalance/:address', authenticateToken, ethereum)


module.exports = router;