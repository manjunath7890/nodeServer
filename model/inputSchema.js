const mongoose = require('mongoose');

const inputSchema = new mongoose.Schema({
  var1: Boolean,
  var2: String,
  timestamp: {
    type: Date,
    default: Date.now,
    get: function(v) {
      return new Date(v).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    },
  },
});

const Input = mongoose.model('Input', inputSchema);
module.exports = Input;
