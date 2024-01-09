const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

// Express server
const app = express();

// DB connection
dbConnection();

// CORS
app.use(cors())

// Public directory
app.use(express.static('public'));

// Read and parse body
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));


// 404
app.use((req, res) => {
    res.status(404).sendFile(__dirname + '/public/404.html');
});

// Listen requests
app.listen(process.env.PORT, () => {
    console.log(`Running on port ${process.env.PORT}`);
});
