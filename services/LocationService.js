var pool = require('../utilities/pool');
var $sql = require('../dao/LocationsMapper');


module.exports = {

    queryAll:function (req, res, next) {
        pool.getConnection(function(err, connection) {
            connection.query($sql.queryAll, function(err, result) {
                console.log(err, result);
                // jsonWrite(res, result);
                connection.release();
            });
        });


    },
    add: function (locationInfo) {
        pool.getConnection(function (err, connection) {

            connection.query($sql.insert, locationInfo, function (err, result) {
                console.log("err: ", +err);
                connection.release();
            });
        });
    }
}