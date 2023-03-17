const mongoose = require('mongoose')
const Rule = require('./rule')

module.exports = new mongoose.Schema({
    type: { type: String, default: "And" },
    value: {type: Number, default: 0},
    rules: {type: [Rule], default:[]}
  });