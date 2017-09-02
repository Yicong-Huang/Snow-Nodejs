var express = require('express');
var router = express.Router();
var URL = require('url');
var User = require('./user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/queryAll', function(req, res, next) {
    
}

module.exports = router;
