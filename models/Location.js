const mongoose = require('mongoose');
// define the Class model schema
const LocationSchema = new mongoose.Schema({
  name: {
    type: String,
    index: { unique: true }
  },
  address: String,
  latitude: Number,
  longitude: Number,
  description: String
});

module.exports = mongoose.model('Location', LocationSchema);
