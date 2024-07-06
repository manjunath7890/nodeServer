const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
      userName: 'string',
      role: 'string',
      email: 'string',
      contact: 'number',
      accessToken: 'string',
      dealerToken: 'string',
      financeToken: 'string',
      password: 'string',
      date: {
        type: Date,
        default: () => new Date().toISOString().slice(0, 10)
      },
  });

  const User = mongoose.model('User', userSchema);
  module.exports = User;

