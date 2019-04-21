/* Import mongoose and define any variables needed to create the schema */
var mongoose = require('mongoose'), 
    Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

/* Create your schema */
var TrafficSchema = new Schema(
    {
        "beacon_id": String,
        "time": Number,
        "detected_dev_dists": [Number],
        expireAt: {
            type: Date,
            default: (new Date()).setHours(new Date().getHours() + 24 * 7)
        },
    }, {
        collection: "Traffic"
    }
);

/* create a 'pre' function that adds the updated_at (and created_at if not already there) property */
TrafficSchema.pre('save', function(next) {
    var currentTime = new Date;
    this.updated_at = currentTime;
    if(!this.created_at) {
        this.created_at = currentTime;
    }
    next();
});

/* Use your schema to instantiate a Mongoose model */
var Traffic = mongoose.model('Traffic', TrafficSchema);

/* Export the model to make it avaiable to other parts of your Node application */
module.exports = Traffic;