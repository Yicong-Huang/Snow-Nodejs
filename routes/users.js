var express = require('express');
var router = express.Router();
var URL = require('url');
var Worker = require('webworker-threads').Worker;
var $service = require('../services/LocationService');
var tracker = require('../utilities/tracker');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/queryAll', function(req, res, next) {
    $service.queryAll(req, res, next);
    res.render('index', {title: 'Express'});

});
router.get('/startLocating', function (req, res, next) {
    // var worker= new Worker('utilities/tracker.js');
    // worker.postMessage("start");
    tracker("hyc541978023@gmail.com", "520965Huang", $service);
    // var worker = new Worker(function(){
    //     this.onmessage= function (event) {
    //         if (event.data === "start"){
    //             postMessage(event.data);
    //             tracker("hyc541978023@gmail.com", "520965Huang");
    //
    //         }
    //
    //         if (event.data === "stop")
    //             postMessage( clearInterval(refreshIntervalId));
    //
    //
    //     };
    //
    // });
    // worker.onmessage = function(event) {
    //     console.log("Worker said : " + event.data);
    // };
    // worker.postMessage("start");
    res.send('Locating Started!');

});

module.exports = router;
