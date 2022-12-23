const mongoose = require('mongoose');
const RecordRules = require('./recordRules')

const UserSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    username : {type: String, require: true, unique: true},
    password : {type: String, require: true},
    money: {type: Number, default: 50000},
    record: {type:[RecordRules], default:[]}
})

module.exports = mongoose.model('User', UserSchema)