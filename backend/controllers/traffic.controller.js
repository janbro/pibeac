/* Dependencies */
var Traffic = require('../models/traffic.model.js');
var Beacon = require('../models/beacon.model');
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

exports.getTrafficByBeaconIdAndType = function(req, res) {
    // minute, hour, day
    let type = req.query.type;
    switch(type) {
        case 'minute':
            {
                Traffic.find({"beacon_id": req.beacon_id}).sort('time').exec((err, docs) =>{ 
                    if(err) {
                        res.status(400).send(err);
                    } else {
                        if(docs.length === 0) {
                            res.status(200).send();
                        } else {
                            let d = new Date();
                            if(d.getTime() - docs[docs.length - 1].time >= 60 * 1000) {
                                let t = docs[docs.length - 1].time;
                                for(let i=0; i < (Math.floor(d.getTime() - t) / (1000 * 60)) && i < 60; i++) {
                                    docs.push({
                                        "detected_dev_dists": [],
                                        "time": t + i * 1000 * 60,
                                    });
                                }
                            }
                            for(let i=docs.length - 1; i > 1; i--) {
                                if((docs[i].time - docs[i - 1].time) / (1000) >= 65) {
                                    const base_time = docs[i].time;
                                    let padding = Math.floor((docs[i].time - docs[i - 1].time) / (1000 * 60));
                                    let offset = padding;
                                    for(padding; padding > 0; padding--) {
                                        docs.splice(i - 1, 0, {
                                            "detected_dev_dists": [],
                                            "time": base_time - (1000 * 60) * padding,
                                        });
                                    }
                                    i -= offset;
                                }
                            }
                            if(docs.length > 60) {
                                docs = docs.slice(docs.length - 60);
                            } else if (docs.length < 60) {
                                while(docs.length < 60) {
                                    docs.push({
                                        "detected_dev_dists": [],
                                        "time": 0,
                                    });
                                }
                            }
                            res.status(200).json(docs);
                        }
                    }
                });
                break;
            }
        case 'hour':
            {
                Traffic.find({"beacon_id": req.beacon_id}).sort('time').exec((err, docs) =>{ 
                    if(err) {
                        res.status(400).send(err);
                    } else {
                        if(docs.length === 0) {
                            res.status(200).send();
                        } else {
                            let d = new Date();
                            if(d.getTime() - docs[docs.length - 1].time >= 60 * 1000) {
                                let t = docs[docs.length - 1].time;
                                for(let i=0; i < (Math.floor(d.getTime() - t) / (1000 * 60)) && i < 60; i++) {
                                    docs.push({
                                        "detected_dev_dists": [],
                                        "time": t + i * 1000 * 60,
                                    });
                                }
                            }
                            for(let i=docs.length - 1; i > 1; i--) {
                                if((docs[i].time - docs[i - 1].time) / (1000) >= 65) {
                                    const base_time = docs[i].time;
                                    let padding = Math.floor((docs[i].time - docs[i - 1].time) / (1000));
                                    let offset = padding;
                                    for(padding; padding > 0; padding--) {
                                        docs.splice(i - 1, 0, {
                                            "detected_dev_dists": [],
                                            "time": base_time - (1000 * 60) * padding,
                                        });
                                    }
                                    i -= offset;
                                }
                            }
                            let hours = 24;
                            let minutes = 0;
                            let avg = 0;
                            let result = [];
                            for(let i = docs.length - 1; i >= 0 && hours > 0; i--) {
                                avg += docs[i].detected_dev_dists.length;

                                if(minutes >= 60 || i === 0) {
                                    result.unshift({
                                        "detected_dev_dists": Array(Math.ceil(avg/minutes)),
                                        "time": docs[i].time,
                                    });
                                    minutes = 0;
                                    hours--;
                                    avg = 0;
                                }
                                minutes++;
                            }
                            if (result.length < 24) {
                                while(result.length < 24) {
                                    result.unshift({
                                        "detected_dev_dists": [],
                                        "time": 0,
                                    });
                                }
                            }
                            res.status(200).json(result);
                        }
                    }
                });
                break;
            }
        case 'day':
            {
                Traffic.find({"beacon_id": req.beacon_id}).sort('time').exec((err, docs) =>{ 
                    if(err) {
                        res.status(400).send(err);
                    } else {
                        let d = new Date();
                        if(d.getTime() - docs[docs.length - 1].time >= 60 * 1000) {
                            let t = docs[docs.length - 1].time;
                            for(let i=0; i < (Math.floor(d.getTime() - t) / (1000 * 60)) && i < 60; i++) {
                                docs.push({
                                    "detected_dev_dists": [],
                                    "time": t + i * 1000 * 60,
                                });
                            }
                        }
                        for(let i=docs.length - 1; i > 1; i--) {
                            if((docs[i].time - docs[i - 1].time) / (1000) >= 65) {
                                const base_time = docs[i].time;
                                let padding = Math.floor((docs[i].time - docs[i - 1].time) / (1000 * 60));
                                let offset = padding;
                                for(padding; padding > 0; padding--) {
                                    docs.splice(i - 1, 0, {
                                        "detected_dev_dists": [],
                                        "time": base_time - (1000 * 60) * padding,
                                    });
                                }
                                i -= offset;
                            }
                        }
                        if(docs.length === 0) {
                            res.status(200).send();
                        } else {
                            let days = 7;
                            let minutes = 0;
                            let avg = 0;
                            let result = [];
                            for(let i = docs.length - 1; i >= 0 && days > 0; i--) {
                                avg += docs[i].detected_dev_dists.length;

                                minutes++;
                                if(minutes >= 60 * 24 || i === 0) {
                                    result.unshift({
                                        "detected_dev_dists": Array(Math.ceil(avg/minutes)),
                                        "time": docs[i].time,
                                    });
                                    minutes = 0;
                                    days--;
                                    avg = 0;
                                }
                            }
                            if (result.length < 7) {
                                while(result.length < 7) {
                                    result.unshift({
                                        "detected_dev_dists": [],
                                        "time": 0,
                                    });
                                }
                            }
                            res.status(200).json(result);
                        }
                    }
                });
                break;
            }
        default:
            {
                res.status(400).send("Type does not exist");
            }
    }
}

exports.addTrafficByBeaconId = function(req, res) {
    var traffic = new Traffic(req.body);
    traffic.beacon_id = req.beacon_id;
    Beacon.findOne({"id": traffic.beacon_id}, (err, beacon) => {
        if(err) {
            console.log(err);
            res.status(400).send(err);
        }
        else if(beacon.collect_data) {
            traffic.save(function (err) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.status(200).send({text: "Saved document " + traffic.beacon_id});
                }
            });
        } else {
            res.status(403).send({error: "User opted to not collect data"});
        }
    });
    
}

exports.getBeaconId = function(req, res, next, beacon_id) {
    req.beacon_id = beacon_id;
    next();
}