const mongoose = require('mongoose');
// define the Class model schema
const ClassSchema = new mongoose.Schema({
  startTime: Date,
  endTime: Date,
  approved: {
    type: Boolean,
    default: false
  },
  user_id: Schema.Types.ObjectId,
  type_id: Schema.Types.ObjectId
});

module.exports = mongoose.model('Class', ClassSchema);
