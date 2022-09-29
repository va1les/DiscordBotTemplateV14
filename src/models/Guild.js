const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    guildId: String,
})

module.exports = mongoose.model('guild', guildSchema);