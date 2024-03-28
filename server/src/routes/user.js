const express = require('express');
const { authenticateToken } = require('../middlewares/middleware');
const router = express.Router();

const {
    getAllUsers,
    userRegistration,
    userLogin,
} = require('../controllers/user');

// Register a new user API
router.post('/register', userRegistration);

// Login a registered user API
router.post('/login', userLogin);

// Authorized user API
router.get('/', authenticateToken, getAllUsers);


module.exports = router;
