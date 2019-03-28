/* Dependencies */
var express = require('express'), 
    router = express.Router(),
    controller = require('../controllers/beacon.controller.js');

/* 
  These method calls are responsible for routing requests to the correct request handler.
  Take note that it is possible for different controller functions to handle requests to the same route.
 */
router.route('/')
  .get(controller.getBeacons);
  //.post();


/* Beacon information
 */
router.route('/:id')
  .get(controller.returnBeacon)
  .patch(controller.ownsBeacon)
  .patch(controller.updateBeaconById);
  // ADMIN ROUTES
  //.delete(controller.delete);

router.param('id', controller.getBeaconById);


module.exports = router;