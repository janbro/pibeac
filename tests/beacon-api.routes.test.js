var should = require('should'), 
    request = require('supertest'),
    express = require('../config/express'),
    mongoose = require('mongoose'), 
    decal = require('../models/beacon.model.js');

/* Global variables */
var server, app, agent, decal;

/* Unit tests for testing server side routes for the garages API */
describe('Controller CRUD tests', function() {

    this.timeout(10000);

    before(function(done) {
        app = express.init();
        server = app.listen(done);
        agent = request.agent(server);
    });

    it('should be able to retrieve beacons', function(done) {
        agent.get('/api/beacons')
            .expect(200)
            .end(function(err, res) {
                should.not.exist(err);
                should.exist(res);
                res.body.should.not.be.empty();
                done();
            });
    });

    it('should be able to retrieve a beacon', function(done) {
        agent.get('/api/beacons/' + '123456789')
            .expect(200)
            .end(function(err, res) {
                console.log(res.body);
                should.not.exist(err);
                should.exist(res);
                res.body.action.name.should.be.eql("URL");
                done();
            });
    });

    after(function(done) {
        mongoose.connection.close();
        server.close(done);
    });
});