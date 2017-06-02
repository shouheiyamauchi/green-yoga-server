const mongoose = require('mongoose');
// define the Class model schema
const TypeSchema = new mongoose.Schema({
  name: {
    type: String,
    index: { unique: true }
  },
  description: String,
  image: String
});

module.exports = mongoose.model('Type', TypeSchema);
