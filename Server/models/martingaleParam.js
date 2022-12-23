const mongoose = require('mongoose')

module.exports = new mongoose.Schema({
    index:{type:Number, default:0},
    priceScale:{type:Number,default:0},
    share:{type:Number,default:0}
})