const express = require('express');
require('./database/mongoose')
const main = require('../../api/routers/main');
const admin = require('../../api/routers/admin');


const app = express();
app.use(express.json());
app.use(main);
app.use(admin);
    

module.exports = app;
