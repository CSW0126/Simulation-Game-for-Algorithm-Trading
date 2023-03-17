const mongoose = require('mongoose')
const MartingaleParam = require('./martingaleParam')
const Condition = require('./condition')

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

    //common lv 2
    price_range_up:{type:Number, default: 0},
    price_range_bot:{type:Number, default: 0},

    //record time
    recordTime:{type:Date, default:new Date()},
    
    //martingale related
    take_profit: {type:Number, default: 0},
    priceScaleData:{type:[MartingaleParam], default:[]},

    //DCA related
    validDate: {type:Number, default:0},
    DCAInvestAmount: {type:Number, default:1},
    period: {type:Number, default:1},

    //Custom Indicator related
    buyCondition:{type: [Condition], default: []},
    sellCondition: {type: [Condition], default: []}

})