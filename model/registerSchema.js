const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
      name: 'string',
      vehicleNo: 'string',
      accessToken: 'string',
      vehicleId: 'string',
      motorNo: 'string',
      chassiNo: 'string',
      batteryId: 'string',
      date: {
        type: Date,
        default: () => new Date().toISOString().slice(0, 10)
      },
      user: String,
      timestamp: {
        type: Date,
        default: Date.now,
        get: function(v) {
          return new Date(v).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
        },
      },
  });

  const Vehicle = mongoose.model('Vehicle', userSchema);
  module.exports = Vehicle;

