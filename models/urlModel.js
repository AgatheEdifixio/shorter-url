const mongoose = require('mongoose');

const urlSchema = mongoose.Schema({
  url: { type: String, required: true }
});

module.exports = mongoose.model('url', urlSchema);