/* Dependencies */
var express = require('express'), 
    router = express.Router(),
    controller = require('../controllers/traffic.controller.js');

/* 
  These method calls are responsible for routing requests to the correct request handler.
  Take note that it is possible for different controller functions to handle requests to the same route.
 */
router.route('/')
  .get(controller.list);
  //.post();


/* Beacon information
 */
router.route('/:id')
  .get(controller.getTrafficByBeaconId)
  .post(controller.addTrafficByBeaconId);
  // ADMIN ROUTES
  //.delete(controller.delete);

router.param('id', controller.getBeaconId);

module.exports = router;