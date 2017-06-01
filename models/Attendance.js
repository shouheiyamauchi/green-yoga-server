const mongoose = require('mongoose');
// define the Class model schema
const AttendanceSchema = new mongoose.Schema({
  user_id: Schema.Types.ObjectId,
  class_id: Schema.Types.ObjectId,
  paid: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
