const mongoose = require('mongoose');
// define the Class model schema
const LessonSchema = new mongoose.Schema({
  date: String,
  startTime: String,
  endTime: String,
  approved: {
    type: Boolean,
    default: false
  },
  user_id: mongoose.Schema.Types.ObjectId,
  type_id: mongoose.Schema.Types.ObjectId,
  location_id: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model('Lesson', LessonSchema);
