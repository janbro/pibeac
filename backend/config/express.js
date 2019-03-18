var path = require('path'),  
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

var __clientdir = './../BeamHubSite/dist/BeamHubSite/';

module.exports.init = function() {
    // Connect to database
    mongoose.connect(config.db.uri, { useNewUrlParser: true });

    // Initialize app
    var app = express();

    app.use(cors());

    //use sessions for tracking logins
    // app.use(session({
    //     secure: 'true',
    //     secret: 'work hard',
    //     resave: true,
    //     saveUninitialized: false
    // }));

    // Enable request logging for development debugging
    app.use(morgan('dev'));

    // Body parsing middleware 
    app.use(bodyParser.json());

    app.use(cookieParser());
    
    app.use('/', express.static(path.resolve(__clientdir)));
    
    app.get('/', function(req, res) {
        res.sendFile('/index.html');
    });

    // Garages endpoint
    app.use('/api/beacons', UserController.authenticate, BeaconRouter);

    // User endpoint
    app.use('/api/users', UserRouter);

    // Go to homepage for all routes not specified
    app.all('/*', function(req, res) {
        res.redirect('/');
    });

    return app;
};