const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    guildId: String,
    userId: String,
})

module.exports = mongoose.model('user', userSchema);