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
        } else {
            res.json(docs);
        }
    });
};

// Returns all beacon data
exports.getBeacons = function(req, res) {
    let userId = JSON.parse(req.cookies['token']).id;
    Beacon.find({"owner": userId}).sort({}).exec((err, docs) =>{
        if(err) {
            console.log(err);
            res.status(400).send(err);
        }
        else {
            res.json(docs);
        }
    });
};

exports.returnBeacon = function(req, res) {
    res.status(200).send(req.beacon);
}

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

// Returns beacon data of passed i
exports.updateBeaconById = function(req, res) {
    Beacon.findOneAndUpdate({ id: req.beacon.id}, { $set: req.body }).exec((err, beacon) =>{
        if(err) {
            console.log(err);
            res.status(400).send(err);
        } else {
            res.json("Updated");
        }
    });
};

exports.ownsBeacon = function(req, res, next) {
    try {
        let id = JSON.parse(req.cookies['token']).id;
        Beacon.findOne({ id: req.beacon.id}).exec((err, beacon) => {
            if(err) {
                console.log(err);
                res.status(400).send(err);
            } else {
                if(beacon.owner === id) {
                    next();
                } else {
                    res.status(403).send("Not authorized!");
                }
            }
        })
    } catch(err) {
        res.status(403).send("Not authenticated!");
    }
}