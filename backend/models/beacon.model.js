/* Import mongoose and define any variables needed to create the schema */
var mongoose = require('mongoose'), 
    Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

/* Create your schema */
var BeaconSchema = new Schema(
    {
        "_id": ObjectId,
        "id": String,
        "name": String,
        "owner": String,
        "collect_data": {
            type: Boolean,
            optional: true
        },
        "action": {
            "value": String,
            "kind": Number
        },
        "distance": {
            type: Number,
            optional: true
        }
    //   "location": {
    //     "latitude": Number,
    //     "longitude": Number
    //   },
    }, {
        collection: "Beacons"
    }
);

/* create a 'pre' function that adds the updated_at (and created_at if not already there) property */
BeaconSchema.pre('save', function(next) {
  var currentTime = new Date;
  this.updated_at = currentTime;
  if(!this.created_at)
  {
    this.created_at = currentTime;
  }
  next();
});

/* Use your schema to instantiate a Mongoose model */
var Beacon = mongoose.model('Beacon', BeaconSchema);

/* Export the model to make it avaiable to other parts of your Node application */
module.exports = Beacon;