module.exports = {
    localhost: {
        host: '127.0.0.1',
        user: 'root',
        password: '123456',
        database:'snow', // 前面建的user表位于这个数据库中
        port: 3306
    },

    cloudSql: {
        host: 'utilities-db.coryhpm7bqn1.us-east-1.rds.amazonaws.com',
        user: 'root',
        password: '520965huang',
        database: 'snow', // 前面建的user表位于这个数据库中
        port: 3306
    },

    cloudSqlFromGAE: {
        socketPath: '/cloudsql/snow-178422:us-west1:utilities-db',
        user: 'root',
        password: '520965',
        database: 'snow' // 前面建的user表位于这个数据库中

    }
};
