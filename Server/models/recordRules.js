const mongoose = require('mongoose')
const MartingaleParam = require('./martingaleParam')

module.exports = new mongoose.Schema({
    //1:martingale, 2: DCA , 3: custom Indicator
    algoType:{type:Number, default: 0, require:true},
    //market type, 1: crypto, 2 stock
    type:{type:Number, default: 0, require:true},
    //trading pair
    pair:{type: String, default:""},
    //date range of historical date used 
    rangeDate:{type:[Date], default:[]},

    //common
    investment:{type:Number, default: 0},
    stop_earn:{type:Number, default: 0},
    stop_loss:{type:Number, default: 0},
    price_range_up:{type:Number, default: 0},
    price_range_bot:{type:Number, default: 0},
    
    //martingale related
    take_profit: {type:Number, default: 0},
    priceScaleData:{type:[MartingaleParam], default:[]}

    //DCA related

    //Custom Indicator related
})