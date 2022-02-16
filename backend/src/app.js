const express = require('express');
require('./database/mongoose')
const main = require('../../api/routers/main');
const admin = require('../../api/routers/admin');

const app = express();
app.use(express.json());

// Remove CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use(main);
app.use(admin);

module.exports = app;
