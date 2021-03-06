let dateTime = require('node-datetime');
let dt = dateTime.create();
dt.format('m/d/Y H:M:S');

var request = require("request");
var util = require("util");


// noinspection JSUnusedGlobalSymbols
findmyphone = {

    getLocationOfDevice: function (device, callback) {

        if (!device.location) {
            return callback("No location in device");
        }

        // noinspection SpellCheckingInspection
        var googleUrl = "http://maps.googleapis.com/maps/api/geocode/json" +
            "?latlng=%d,%d&sensor=true";

        googleUrl =
            util.format(googleUrl,
                device.location.latitude, device.location.longitude);

        var req = {
            url: googleUrl,
            json: true
        };

        request(req, function (err, response, json) {
            if (!err && response.statusCode === 200) {
                if (Array.isArray(json.results) &&
                    json.results.length > 0 &&
                    json.results[0].hasOwnProperty("formatted_address")) {

                    return callback(err, json.results[0].formatted_address);
                }
            }
            return callback(err);
        });

    },
    getDistanceOfDevice: function (device, myLatitude, myLongitude, callback) {
        if (device.location) {

            var googleUrl = "http://maps.googleapis.com/maps/api/distancematrix/json" +
                "?origins=%d,%d&destinations=%d,%d&mode=driving&sensor=false";

            googleUrl =
                util.format(googleUrl, myLatitude, myLongitude,
                    device.location.latitude, device.location.longitude);

            var req = {
                url: googleUrl,
                json: true
            };

            request(req, function (err, response, json) {
                if (!err && response.statusCode === 200) {
                    if (json && json.rows && json.rows.length > 0) {
                        return callback(err, json.rows[0].elements[0]);
                    }
                    return callback(err);
                }
            });

        } else {
            callback("No location found for this device");
        }
    }
};

// legacy
let refreshIntervalId;

let find_my_iphone_loop = function (apple_id, password, service, callback) {

    if (!service) {
        var mysql = require('mysql');
        let $db = require('../configs/db');
        var pool = mysql.createPool($db.cloudSql);
        service = {
            add: function (locationInfo) {
                pool.getConnection(function (err, connection) {
                    // noinspection JSUnusedLocalSymbols
                    connection.query('INSERT INTO `snow`.`locations` (`locationName`, `latitude`, `longitude`, `isOld`, `batteryLevel`) VALUES (?, ?, ?, ?, ?)', locationInfo, function (err, result) {
                        console.log("err: ", +err);
                        connection.release();
                    });
                });
            }
        };
    }


    console.log("find my iphone initialing...");
    findmyphone.apple_id = apple_id;
    findmyphone.password = password;

    if (!findmyphone.hasOwnProperty("apple_id") || !findmyphone.hasOwnProperty("password"))
        return callback("Please define apple_id / password");

    if (findmyphone.apple_id === null || findmyphone.password === null)
        return callback("Please define apple_id / password");


    findmyphone.jar = request.jar();


    findmyphone.iRequest = request.defaults({
        jar: findmyphone.jar,
        headers: {"Origin": "https://www.icloud.com"}
    });

    let options = {
        url: "https://setup.icloud.com/setup/ws/1/login",
        json: {
            "apple_id": findmyphone.apple_id,
            "password": findmyphone.password,
            "extended_login": true
        }
    };
    findmyphone.iRequest.post(options, function (error, response, body) {
        console.log("logging to apple...");
        if (!response || response.statusCode !== 200) {
            return callback("Login Error");
        }
        console.log("logged in successfully!");
        refreshIntervalId = setInterval(function track() {
            try {
                console.log("looking for devices...");
                if (body.hasOwnProperty("webservices") && body.webservices.hasOwnProperty("findme")) {
                    findmyphone.base_path = body.webservices.findme.url;
                    options = {
                        url: findmyphone.base_path + "/fmipservice/client/web/initClient",
                        json: {
                            "clientContext": {
                                "appName": "iCloud Find (Web)",
                                "appVersion": "2.0",
                                "timezone": "US/Eastern",
                                "inactiveTime": 3571,
                                "apiVersion": "3.0",
                                "fmly": true
                            }
                        }
                    };
                    findmyphone.iRequest.post(options, function (error, response, body) {
                        let device;
                        // Retrieve each device on the account
                        if (body)
                            body.content.forEach(function (d) {
                                if (d.deviceModel === 'iphone7plus-2-4-0')
                                    device = d;
                            });
                        else
                            console.log("error:  no body returned.");
                        if (device) {
                            console.log("found");
                            findmyphone.getLocationOfDevice(device, function (err, location) {
                                console.log(new Date(dt.now()), location);
                                console.log(location);
                                if (typeof(location) !== "undefined") {
                                    service.add([location, device.location.latitude, device.location.longitude, device.location.isOld, device.batteryLevel]);
                                }
                            });
                        } else
                            console.log("error:  no device found.");
                    });
                }
            } catch (e) {
                console.log(e);
            }
            return track;
        }(), 60000);
    });
};


find_my_iphone_loop.findmyphone = findmyphone;

if (!module.parent) {
    // ran with `node something.js`
    find_my_iphone_loop("hyc541978023@gmail.com", "520965Huang");

} else {
    // used with `require('/.something.js')`
    module.exports = find_my_iphone_loop;
}




