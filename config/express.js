var path = require('path'),  
    express = require('express'), 
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    BeaconRouter = require('../routes/beacon-api.routes');
const cors = require('cors');

var __clientdir = './dist';

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
  
  app.use('/', express.static(path.resolve(__clientdir)));
  
  app.get('/', function(req, res) {
    res.sendFile('/index.html');
  });

  // Garages endpoint
  app.use('/api/beacons', BeaconRouter);

  // Go to homepage for all routes not specified
  app.all('/*', function(req, res) {
    res.redirect('/');
  });

  return app;
};