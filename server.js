// Import Dependencies
const express = require('express');
const mongoose = require('mongoose');
const db = require('./config/connection');
const routes = require('./routes');

// configure PORT
const PORT = process.env.PORT || 3001;
// create express app
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

//database connection
db.once('open', () => {
    // start the server
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
    });
});