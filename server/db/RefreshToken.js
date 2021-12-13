const mongoose = require('mongoose')

const refreshTokenSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    RefreshToken: String
})

module.exports = mongoose.model('RefreshToken', refreshTokenSchema)