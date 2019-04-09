/* Import mongoose and define any variables needed to create the schema */
var mongoose = require('mongoose'), 
    crypto = require('crypto'),
    jwt = require('jsonwebtoken'),
    Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

/* Create your schema */
var UserSchema = new Schema(
    {
        "_id": ObjectId,
        "name": {
            type: String,
            required: true
        },
        "username": {
            type: String,
            required: true,
            unique: true
        },
        "passwdhash": {
            type: String,
            required: true
        },
        "salt": {
            type: String,
            required: true
        },
        "email": {
            type: String,
            required: true,
            unique: true
        },
        "beaconGroups": [{
            "name": String,
            "beacons": [String]
        }]
  }, {
    collection: "Users"
  }
);

UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.passwdhash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  };
  
UserSchema.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.passwdhash === hash;
};

UserSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 1);

    return jwt.sign({
        email: this.email,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, process.env.TOKEN_SIG);
}

UserSchema.methods.toAuthJSON = function() {
    return {
        _id: this._id,
        email: this.email,
        token: this.generateJWT(),
    };
};
  

/* create a 'pre' function that adds the updated_at (and created_at if not already there) property */
UserSchema.pre('save', function(next) {
  var currentTime = new Date;
  this.updated_at = currentTime;
  if(!this.created_at)
  {
    this.created_at = currentTime;
  }
  next();
});

/* Use your schema to instantiate a Mongoose model */
var User = mongoose.model('User', UserSchema);

/* Export the model to make it avaiable to other parts of your Node application */
module.exports = User;