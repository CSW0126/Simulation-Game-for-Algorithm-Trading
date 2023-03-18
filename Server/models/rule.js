const mongoose = require('mongoose')

module.exports = new mongoose.Schema({
      expression1: {
        type: { type: String, default: "Close Price" },
        param: {          
          timePeriod: {type: Number},
          value: {type: Number}}
      },
      operator: {type: String, default: ">"},
      expression2: {
        type: { type: String, default: "Open Price" },
        param: {
          timePeriod: {type: Number},
          value: {type: Number}
        }
      }

});