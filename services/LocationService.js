var pool = require('../utilities/pool');
var $sql = require('../dao/LocationsMapper');


var jsonWrite = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};

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