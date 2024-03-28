const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// Load Swagger YAML file
const swaggerDocument = YAML.load(path.resolve(__dirname, './swagger.yaml'));

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
