const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    username : {type: String, require: true, unique: true},
    password : {type: String, require: true},
    money: {type: Number, default: 50000}
})

module.exports = mongoose.model('User', UserSchema)