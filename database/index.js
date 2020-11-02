const mongoose = require("mongoose");

const { dbHost, dbUser, dbPort, dbPass, dbName } = require("../app/config");

mongoose.connect(`mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useFindAndModify : false
});

const db = mongoose.connection;

// console.log(`mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`);


module.exports = db;