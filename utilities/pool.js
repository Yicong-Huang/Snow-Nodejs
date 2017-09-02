var mysql = require('mysql');
var $db = require('../configs/db');

//获取本地IP地址
var os = require('os');
console.log(os.hostname());
if (os.hostname().indexOf('vpn') !== -1) {
    var pool = mysql.createPool($db.localhost);
    console.log("connecting to localhost");
}


else {
    var pool = mysql.createPool($db.cloudSql);
    console.log("connecting to cloudSql");
}
module.exports = pool;