/* Dependencies */
var Beacon = require('../models/beacon.model.js');
var User = require('../models/user.model.js');

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
exports.getBeacons = async function(req, res) {
    try {
        let userId = JSON.parse(req.cookies['token']).id;

        User.findOne({"_id": userId}).exec(async (err, docs) => {
            if(err) {
                console.log(err);
                res.status(400).send(err);
            }
            else {
                beaconGroups = await Promise.all(docs.beaconGroups.map(async (group) => {
                    beacons = await Promise.all(group.beacons.map(async (beaconId) => {
                        try {
                            beacon = await Beacon.findOne({"_id": beaconId}).exec();
                            return beacon;
                        }
                        catch(err) {
                            console.log(err);
                            return false;
                        }
                    }));
                    return { name: group.name, beacons: beacons };
                }));
                res.status(200).send(beaconGroups);
            }
        });
    } catch(err) {
        res.status(403).send("Not authenticated!");
    }
};

exports.returnBeacon = function(req, res) {
    res.status(200).send(req.beacon);
}

// Returns beacon data of passed i
exports.getBeaconById = function(req, res, next, id) {
    let distance = req.query.dist;
    Beacon.findOne({id: id}).exec((err, beacon) =>{
        if(err) {
            console.log(err);
            res.status(400).send(err);
        } else if(distance && distance < beacon.distance) {
            User.findOne({'_id': beacon.owner}).exec((err, user) => {
                if(err) {
                    console.log(err);
                    res.status(400).send(err);
                } else {
                    let beac = beacon.toObject();
                    beac.ownername = user.name;
                    req.beacon = beac;
                    next();
                }
            });
        } else if(!distance) {
            User.findOne({'_id': beacon.owner}).exec((err, user) => {
                if(err) {
                    console.log(err);
                    res.status(400).send(err);
                } else {
                    let beac = beacon.toObject();
                    beac.ownername = user.name;
                    req.beacon = beac;
                    next();
                }
            });
        } else {
            res.status(403).send({text: "User not close enough"});
        }
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