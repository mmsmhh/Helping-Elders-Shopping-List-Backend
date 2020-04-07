const config = require('./configurations');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodayParser = require('body-parser');
const morgan = require('morgan');

const app = express();

app.use(express.static('public'));

mongoose.Promise = global.Promise;

mongoose.connect(config.MONGODB_URI, { useFindAndModify: false, useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });

mongoose.connection.on('connected', () => {
    console.log('Connected to the database.');
});

mongoose.connection.on('error', (err) => {
    console.log(`Unable to connect to the database: ${err}.`);
});

app.use(morgan('dev'));

app.use(cors());

app.use(bodayParser.json());

const routes = require('./routes');

app.use('/', routes);

app.use((err, _req, res, next) => {
    if (err.statusCode === 404) return next();
    console.log(err)
    res.status(500).json({
        err: err.message,
        msg: '500 Internal server error.',
        data: null,
    });
});

app.use((_req, res) => {
    res.status(404).json({
        err: null,
        msg: '404 Not found.',
        data: null,
    });
});

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}.`);
});