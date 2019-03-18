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
            console.log(err);
            res.status(400).send(err);
        }
        res.json(docs);
    });
};

exports.register = async function(req, res) {
    console.log(req.body);
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
                console.log(err);
                res.status(400).send(err);
            } else {
                res.send('Success');
            }
        });
    }
}

exports.authenticate = function(req, res, next) {
    let token = req.cookies['token'];
    jwt.verify(token, process.env.TOKEN_SIG, function(err, decoded) {
        if(err) {
            res.status(400).send(err);
        } else if(decoded) {
            console.log(decoded);
            return next();
        } else {
            res.status(403).send('Not authenticated!');
        }
    });
}

exports.login = function(req, res) {
    User.findOne({'username': req.body.username}).exec((err, doc) =>{
        let user = new User(doc);
        if(err) {
            console.log(err);
            res.status(400).send(err);
        } else if(doc === null) {
            res.status(400).send('User does not exist!');
        } else if(user.validatePassword(req.body.password)) {
            res.cookie('token', user.generateJWT());
            res.status(200).send();
        } else {
            res.status(403).send('Incorrect user or password');
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

// Returns user of passed id
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

// Returns user of passed id
exports.getUserById = function(req, res, next, id) {
    User.findOne({'id': id}).exec((err, user) =>{
      if(err) {
        console.log(err);
        res.status(400).send(err);
      }
      req.user = user;
      next();
    });
};