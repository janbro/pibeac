var path = require('path'),
    url = require('url'),   
    express = require('express'), 
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    config = require('./config'),
    UserController = require('../controllers/user.controller.js'),
    BeaconRouter = require('../routes/beacon-api.routes'),
    UserRouter = require('../routes/user.routes');
const cors = require('cors');

var __clientdir = './../frontend/dist/pibeac/';

module.exports.init = function() {
    // Connect to database
    mongoose.connect(config.db.uri, { useNewUrlParser: true });

    // Initialize app
    var app = express();

    app.use(cors());

    // Enable request logging for development debugging
    app.use(morgan('dev'));

    // Body parsing middleware 
    app.use(bodyParser.json());

    app.use(cookieParser());
    
    app.use('/', express.static(path.resolve(__clientdir)));

    app.use('/notfound', express.static(path.resolve(__clientdir)));

    // Garages endpoint
    app.use('/api/beacons', UserController.authenticate, BeaconRouter);

    // User endpoint
    app.use('/api/users', UserRouter);

    // Catch all other routes and return the index file
    app.get('*', (req, res) => {
        res.sendFile(path.join(path.resolve(__clientdir), '/index.html'));
    });

    return app;
};