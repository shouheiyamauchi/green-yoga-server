const mongoose = require('mongoose');
// define the Class model schema
const AttendanceSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  class_id: mongoose.Schema.Types.ObjectId,
  paid: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
