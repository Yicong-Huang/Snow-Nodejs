module.exports = {
    insert: 'INSERT INTO `snow`.`locations` (`locationName`, `latitude`, `longitude`, `isOld`, `batteryLevel`) VALUES (?, ?, ?, ?, ?)',
    // update:'update user set name=?, age=? where id=?',
    // delete: 'delete from user where id=?',
    // queryById: 'select * from user where id=?',
    queryAll: 'select * from locations'
};

