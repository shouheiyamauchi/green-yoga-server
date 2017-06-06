const mongoose = require('mongoose');
// define the Class model schema
const PassSchema = new mongoose.Schema({
  name: {
    type: String,
    index: { unique: true }
  },
  price: Number,
  uses: Number,
  expiry: Date
});

module.exports = mongoose.model('Pass', PassSchema);
