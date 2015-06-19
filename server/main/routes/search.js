var express = require('express'),
	router = express.Router(),
	searchService = require('../services/searchService');

/* GET home page. */
router.get('/', searchService.query.get);

module.exports = router;
