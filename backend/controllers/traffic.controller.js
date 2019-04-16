/* Dependencies */
var Traffic = require('../models/traffic.model.js');
var jwt = require('jsonwebtoken');

exports.read = function(req, res) {
    /* send back the beacons as json from the request */
    res.json(req.beacon);
};

// Returns all user data
exports.list = function(req, res) {
    Traffic.find({}).sort({}).exec((err, docs) =>{
        if(err) {
            res.status(400).send(err);
        } else {
            res.status(200).json(docs);
        }
    });
};

exports.getTrafficByBeaconId = function(req, res) {
    let min = req.query.min;
    let max = req.query.max
    if (min && max) {
        Traffic.find({"beacon_id": req.beacon_id, "time": { $gt : min, $lt : max}}).sort('time').exec((err, docs) =>{ 
            if(err) {
                res.status(400).send(err);
            } else {
                res.status(200).json(docs);
            }
        });
    } else if (min) {
        Traffic.find({"beacon_id": req.beacon_id, "time": { $gt : min }}).sort('time').exec((err, docs) =>{ 
            if(err) {
                res.status(400).send(err);
            } else {
                res.status(200).json(docs);
            }
        });
    } else {
        Traffic.find({"beacon_id": req.beacon_id}).sort('time').exec((err, docs) =>{ 
            if(err) {
                res.status(400).send(err);
            } else {
                res.status(200).json(docs);
            }
        });
    }
}

exports.addTrafficByBeaconId = function(req, res) {
    var traffic = new Traffic(req.body);
    traffic.beacon_id = req.beacon_id;
    traffic.save(function (err) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send({text: "Saved document " + traffic.beacon_id});
        }
    });
    
}

exports.getBeaconId = function(req, res, next, beacon_id) {
    req.beacon_id = beacon_id;
    next();
}