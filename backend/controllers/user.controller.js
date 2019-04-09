/* Dependencies */
var User = require('../models/user.model.js');
var jwt = require('jsonwebtoken');

exports.read = function(req, res) {
    /* send back the beacons as json from the request */
    res.json(req.beacon);
};

// Returns all user data
exports.list = function(req, res) {
    User.find({}).sort({}).exec((err, docs) =>{
        if(err) {
            res.status(400).send(err);
        }
        res.json(docs);
    });
};

exports.register = async function(req, res) {
    let user =  new User({
        'username': req.body.username,
        'name': req.body.name,
        'email': req.body.email
    });
    let check = await User.findOne({'username': user.username});
    if(check != null) {
        res.status(405).send('Username exists');
    }
    else {
        user.setPassword(req.body.password);
        user.save((err) => {
            if(err) {
                res.status(400).send(err);
            } else {
                res.status(200).send(user);
            }
        });
    }
}

exports.authenticate = function(req, res, next) {
    try {
        let token = JSON.parse(req.cookies['token']).token;
        decodeToken(token, function(err, decoded) {
            if(err instanceof SyntaxError) {
                res.status(403).send("Incorrect credentials!");
            } else if(err) {
                res.status(400).send("Something went wrong!");
            } else if(decoded) {
                // Token valid
                next();
            } else {
                res.status(403).send("Not authenticated!");
            }
        });
    } catch(err) {
        res.status(403).send("Not authenticated!");
    }
}

exports.login = function(req, res) {
    User.findOne({'username': req.body.username}).exec((err, doc) =>{
        let user = new User(doc);
        if(err) {
            res.status(400).send(err);
        } else if(doc === null) {
            res.status(400).send('User does not exist!');
        } else if(user.validatePassword(req.body.password)) {
            userToken = undefined;
            try {
                userToken = user.generateJWT();
                res.cookie('token', JSON.stringify({ id: user.id, token: userToken }));
                res.status(200).send({_id:user._id, username: user.username, name: user.name, email: user.email});
            } catch(err) {
                console.log(err);
                res.status(500).send('Token could not be signed!');
            }
        } else {
            res.status(401).send('Incorrect user or password!');
        }
    });
}

exports.update = function(req, res, id) {
    User.findOneAndUpdate({'_id': id}, req.body).exec((err, docs) => {
        if(err) {
            console.log(err);
            res.status(400).send(err);
        }
        if(docs == null) {
            res.status(400).send('User does not exist!');
        }

    });
}

exports.delete = function(req, res) {
    User.deleteOne({'_id': id}).exec((err) => {
        if(err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200);
    });
}

// Returns user
exports.getUser = function(req, res, id) {
    let user = {
        _id: req.user._id,
        name: req.user.name,
        username: req.user.username,
        email: req.user.email
    };
    res.status(200).send(user);
};

// Sets user of passed id
exports.getUserByUsername = function(req, res, next, username) {
    User.findOne({'username': username}).exec((err, user) =>{
        if(err) {
            console.log(err);
            res.status(400).send(err);
        }
        req.user = user;
        next();
    });
};

// Sets user of passed id
exports.getUserById = function(req, res, next, id) {
    User.findOne({'_id': id}).exec((err, user) =>{
        if(err) {
            console.log(err);
            res.status(400).send(err);
        }
        req.user = user;
        next();
    });
};

exports.getGroupName = function(req, res, next, groupname) {
    req.groupname = groupname;
    next();
}

/**
 * Beacon Group Functions
 */
exports.addGroup = function(req, res) {
    console.log(req.body.name);
    let name = req.body.name;
    try {
        let id = JSON.parse(req.cookies['token']).id;
        let newgroup = { name: name, beacons: [] };
        console.log(newgroup);
        User.findOneAndUpdate({'_id': id}, { "$push": { beaconGroups: newgroup }}).exec((err, docs) => {
            if(err) {
                console.log(err);
                res.status(400).send(err);
            } else {
                res.status(200).send({text:"Added group!"});
            }
        });
    } catch(err) {
        res.status(400).send({error:"Cannot add group"});
    }
}

/**
 * Beacon Group Functions
 */
exports.deleteGroup = function(req, res) {
    try {
        let id = JSON.parse(req.cookies['token']).id;
        User.findOneAndUpdate({'_id': id },
        { '$pull': {
            beaconGroups: {
                name: req.groupname
            }
        }}).exec((err, docs) => {
            if(err) {
                console.log(err);
                res.status(400).send(err);
            } else {
                res.status(200).send({text: "Deleted group " + req.groupname});
            }
        });
    } catch(err) {
        console.log(err);
        res.status(400).send({error:"Cannot delete group"});
    }
}

/**
 * Updates the order of beacons in a group
 */
exports.updateBeaconOrder = function(req, res) {
    let name = req.body.name;
    let beacon_ids = req.body.beacon_ids;
    try {
        let id = JSON.parse(req.cookies['token']).id;
        User.findOneAndUpdate({'_id': id, 'beaconGroups.name':name},
        { '$set': {
            'beaconGroups.$.beacons': beacon_ids
        }}).exec((err, docs) => {
            if(err) {
                console.log(err);
                res.status(400).send(err);
            } else {
                res.status(200).send({text:"reordered"});
            }
        });
    } catch(err) {
        res.status(400).send({error:"Cannot order beacons"});
    }
}

/**
 * Update assigned beaon group
 */
exports.updateBeaconGroup = function(req, res) {
    let beacon_id = req.body.beacon_id;
    let groupname = req.body.groupname;
    let oldgroupname = req.body.oldgroupname;
    try {
        let id = JSON.parse(req.cookies['token']).id;
        User.findOneAndUpdate({'beaconGroups.name':groupname},
        { '$push': {
            'beaconGroups.$.beacons': beacon_id
        }}).exec((err, docs) => {
            if(err) {
                console.log(err);
                res.status(400).send(err);
            } else {
                User.findOneAndUpdate({'beaconGroups.name':oldgroupname},
                { '$pull': {
                    'beaconGroups.$.beacons': beacon_id
                }}).exec((err, docs) => {
                    if(err) {
                        console.log(err);
                        res.status(400).send(err);
                    } else {
                        res.status(200).send({text:"reordered"});
                    }
                });
            }
        });
    } catch(err) {
        res.status(400).send({error:"Cannot order beacons"});
    }
}

/**
 * Decodes jwt token with process env signature
 *
 * @param token JWT Token
 * @param callback Callback function
 */
decodeToken = function(token, callback) {
    return jwt.verify(token, process.env.TOKEN_SIG, callback);
}