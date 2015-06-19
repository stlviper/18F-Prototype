var express = require('express');
var router = express.Router();
var usersService = require('../services/usersService');

/* GET home page. */
router.get('/', usersService.users.get);

module.exports = router;
