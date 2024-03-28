const express = require('express');
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// Swagger options
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Public API Documentation',
            version: '1.0.0',
            description: 'Documentation for public API endpoints',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Local server',
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define API endpoint for fetching data
/**
 * @swagger
 * /:
 *   get:
 *     summary: Test endpoint
 *     description: Test endpoint to check if the server is running
 *     responses:
 *       '200':
 *         description: Server is running
 */
app.get('/', (req, res) => {
    res.send("Hello");
});

// Mount the user router
const userRouter = require('./routes/user');
app.use('/user', userRouter);

const publicRouter = require('./routes/publicApis');
app.use('/public', publicRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong', success: false });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
