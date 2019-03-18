try {
    var SECRETS = require('../secrets.json');
    var CREDS = SECRETS.MONGO_CREDENTIALS;
}
catch(e) {
    if (e.code !== "MODULE_NOT_FOUND")
        throw e;
    var CREDS = process.env.MONGO_CREDENTIALS;
}

module.exports = {
    db: {
      uri: 'mongodb://' + CREDS + '@ds151805.mlab.com:51805/beamhub', //place the URI of your mongo database here.
    },
    port: process.env.PORT || 8080
};