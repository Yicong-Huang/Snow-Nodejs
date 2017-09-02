var mysql = require('mysql');
var $conf = require('../configs/db');
var $util = require('../utilities/utilities');
var $sql = require('../services/LocationService');

// 使用连接池，提升性能
var pool  = mysql.createPool($util.extend({}, $conf.mysql));

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
                jsonWrite(res, result);
                connection.release();
            });
        });

    }
}