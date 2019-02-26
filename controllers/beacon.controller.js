/* Dependencies */
var Beacon = require('../models/beacon.model.js');

exports.read = function(req, res) {
  /* send back the beacons as json from the request */
  res.json(req.beacon);
};

// Returns all beacon data
exports.list = function(req, res) {
  Beacon.find({}).sort({}).exec((err, docs) =>{
    if(err) {
      console.log(err);
      res.status(400).send(err);
    }
    res.json(docs);
  });
};

// Returns beacon data of passed i
exports.getBeaconById = function(req, res, next, id) {
  Beacon.findOne({id: id}).exec((err, beacon) =>{
    if(err) {
      console.log(err);
      res.status(400).send(err);
    }
    req.beacon = beacon;
    next();
  });
};