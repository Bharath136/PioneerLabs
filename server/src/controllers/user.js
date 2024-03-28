const client = require('../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// User Registration
const userRegistration = async (req, res) => {
    const {
        first_name,
        last_name,
        email_address,
        contact_number,
        password,
    } = req.body;

    try {
        const emailExistsQuery = `
            SELECT EXISTS (
                SELECT 1
                FROM user_logins
                WHERE email_address = $1
            ) AS email_exists;
        `;
        const emailCheckResult = await client.query(emailExistsQuery, [email_address]);

        if (emailCheckResult.rows[0].email_exists) {
            return res.status(400).json({ success: false, error: 'Email address already exists' });
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        const insertUserQuery = `
            INSERT INTO user_logins (first_name, last_name, email_address, contact_number, password)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING user_id
        `;
        const values = [
            first_name,
            last_name,
            email_address,
            contact_number,
            hashedPassword
        ];

        const result = await client.query(insertUserQuery, values);
        res.status(201).json({ success: true, message: 'User registered successfully', user_id: result.rows[0].user_id });

    } catch (error) {
        res.status(500).json({ success: false, error: 'Error registering user' });
    }
};


// user login
const userLogin = async (req, res) => {
    const { email_address, password } = req.body;

    try {
        const query = 'SELECT * FROM user_logins WHERE email_address = $1';

        const result = await client.query(query, [email_address]);

        if (result.rows.length !== 1) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const user = result.rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }
        const token = jwt.sign({ user_id: user.user_id, role: user.role }, 'your-secret-key');

        res.header('x-auth-token', token).json({ message: 'Login successful', token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Get all users
const getAllUsers = async (req, res) => {
    try {
        const query = 'SELECT * FROM user_logins';
        const result = await client.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {
    getAllUsers,
    userRegistration,
    userLogin,
};
