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
  Attendance.find(...attendanceData)
    .then(attendance => {
      console.log(attendance)
      if (attendance.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Error: An attendance with those details already exists.'
        });
      } else {
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
      }
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
  Attendance.findOne({ user_id: req.query.user_id, lesson_id: req.query.lesson_id })
    .then(attendance => {
      if (attendance == null) {
        res.json({
          attendance: false
        })
      } else {
        res.json({
          attendance: true
        })
      }
    });
};

exports.checkDeleteAttendance = (req,res) => {
  Attendance.findOne({ user_id: req.query.user_id, lesson_id: req.query.lesson_id })
    .then(attendance => {
      Attendance.findByIdAndRemove({_id: attendance._id},
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
    });
};

exports.userCheckAttendance = (req,res) => {
  Attendance.find({ user_id: req.params.id })
    .then(attendances => {
      res.json({
        attendances
      })
    });
};

exports.lessonCheckAttendance = (req,res) => {
  Attendance.find({ lesson_id: req.params.id })
    .then(attendances => {
      res.json({
        attendances
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
