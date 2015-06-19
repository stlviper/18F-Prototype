var express = require('express'),
  router = express.Router(),
  defaultController = require('../controllers/defaultController');

/* GET home page. */
router.get('/', defaultController.home.get);

module.exports = router;
