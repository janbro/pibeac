var config = require('./config'),
    express = require('./express'),
    https = require('https'),
    fs = require('fs');

module.exports.start = function() {
    var app = express.init();

    let httpsOptions;
    try {
        httpsOptions = {
            key: fs.readFileSync('./key.pem'),
            cert: fs.readFileSync('./cert.pem')
        }

        https.createServer(httpsOptions, app).listen(config.port, function() {
            console.log('App listening on port', config.port);
        });
    } catch (err) {
        if(err.code !== 'ENOENT') {
            console.log(err);
        } else {
            app.listen(config.port, function() {
                console.log('App listening on port', config.port);
            });
        }
    }
};