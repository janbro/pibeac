var SECRETS = require('../secrets.json');

module.exports = {
    db: {
      uri: 'mongodb://' + SECRETS.MONGO_CREDENTIALS + '@ds151805.mlab.com:51805/beamhub', //place the URI of your mongo database here.
    },
    port: process.env.PORT || 8080
};