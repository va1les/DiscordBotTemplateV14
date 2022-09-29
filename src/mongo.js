const mongoose = require("mongoose");

mongoose.connect(process.env.uri, { keepAlive: true });

mongoose.connection.on("connected", () => {
    console.log(`[MongoDB]: `.green.bold + `Mongoose has successfully connected!`.blue.bold)
})

mongoose.connection.on('err', err => {
    console.log(`[MongoDB]: `.green.bold + `Mongoose connection error:\n${err.stack}`.red.bold)
});

mongoose.connection.on('disconnected', () => {
    console.log(`[MongoDB]: `.green.bold + `Mongoose connection lost!`.yellow.bold)
});