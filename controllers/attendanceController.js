const Attendance = require('mongoose').model('Attendance');
const mongoose = require('mongoose');

exports.getAttendances = (req,res) => {
  Attendance.find()
    .then(attendances => {
      res.json({
        attendances,
        message: "The attendances list has been successfully loaded."
      })
    })
};

exports.postAttendance = (req, res) => {
  const attendanceData = {
    user_id: mongoose.Types.ObjectId(req.query.user_id.trim()),
    lesson_id: mongoose.Types.ObjectId(req.query.lesson_id.trim())
  }
  const newAttendance = new Attendance(attendanceData);
  newAttendance.save((err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: 'Error: Failed to process the form.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'You have successfully created a new attendance.'
    });
  });
};

exports.getAttendance = (req,res) => {
  Attendance.findOne({ _id: req.params.id})
    .then(attendance => {
      res.json({
        attendance
      })
    });
};

exports.checkAttendance = (req,res) => {
  console.log("does this happen")
  Attendance.findOne({ user_id: req.query.user_id, class_id: req.query.class_id })
    .then(attendance => {
      res.json({
        attendance
      })
    });
};

exports.deleteAttendance = function(req, res){
	Attendance.findByIdAndRemove({_id: req.params.id},
    function(err){
    	if(err) {
        res.status(400).json({
          success: false,
          message: 'Failed to remove attendance.'
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'You have successfully deleted the attendance.'
        });
      };
    });
};
