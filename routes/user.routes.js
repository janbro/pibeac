/* Dependencies */
var express = require('express'), 
    router = express.Router(),
    controller = require('../controllers/user.controller.js');

/* 
  These method calls are responsible for routing requests to the correct request handler.
  Take note that it is possible for different controller functions to handle requests to the same route.
 */
router.route('/')
  .get(controller.list);
  //.post();

router.route('/:id')
  .get(controller.getUserById)
  .put(controller.update)
  .delete(controller.delete);

/* Beacon information
 */
router.route('/register')
  .post(controller.register);

router.route('/login')
  .post(controller.login);

// GET /logout
router.get('/logout', function(req, res, next) {
    if (req.session) {
      // delete session object
      req.session.destroy(function(err) {
        if(err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }
});

router.route('/authenticate')
  .post(controller.authenticate);

router.param('id', controller.getUserById);

module.exports = router;