const mongoose = require('mongoose')

module.exports = new mongoose.Schema({
      expression1: {
        type: { type: String, default: "Close Price" },
        param: {type: [mongoose.Schema.Types.Mixed], default:[]}
      },
      operator: {type: String, default: ">"},
      expression2: {
        type: { type: String, default: "Open Price" },
        param: {type: [mongoose.Schema.Types.Mixed], default:[]}
      }

});