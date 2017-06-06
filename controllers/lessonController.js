const Lesson = require('mongoose').model('Lesson');
const mongoose = require('mongoose');
const moment = require('moment');

// "class" is a reserved name so had to use "lesson" instead
function validateLessonForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  // check that date entered is in correct format
  const dateFormat = "DD/MM/YYYY";
  if (!payload || !moment((payload.date.trim()), dateFormat).isValid() || payload.date.trim().length === 0) {
      isFormValid = false;
      errors.date = 'Please provide a valid date.';
    }

  if (!payload || typeof payload.startTime !== 'string' || payload.startTime.trim().length === 0) {
      isFormValid = false;
      errors.startTime = 'Please provide a start time.';
    }

  if (!payload || typeof payload.endTime !== 'string' || payload.endTime.trim().length === 0) {
      isFormValid = false;
      errors.endTime = 'Please provide an end time.';
    }

  if (!payload || typeof payload.user_id !== 'string' || payload.user_id.trim().length === 0) {
      isFormValid = false;
      errors.user_id = 'Please select a teacher.';
    }

  if (!payload || typeof payload.type_id !== 'string' || payload.type_id.trim().length === 0) {
      isFormValid = false;
      errors.type_id = 'Please select a class type.';
    }

  if (!payload || typeof payload.location_id !== 'string' || payload.location_id.trim().length === 0) {
      isFormValid = false;
      errors.location_id = 'Please select a location.';
    }

  if (!isFormValid) {
    message = 'Please check the form for errors:';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

exports.getLessons = (req,res) => {
  Lesson.find()
    .then(lessons => {
      res.json({
        lessons,
        message: "The classes list has been successfully loaded."
      })
    })
};

exports.postLesson = (req, res) => {
  const validationResult = validateLessonForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }
  // make sure the date formatting is universal
  const dateFormat = "DD/MM/YYYY";
  const lessonData = {
    date: moment(req.body.date.trim(), dateFormat).format("DD/MM/YYYY"),
    startTime: req.body.startTime.trim(),
    endTime: req.body.endTime.trim(),
    approved: true
  }
  const newLesson = new Lesson(lessonData);
  newLesson.save((err) => {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // the 11000 Mongo code is for a duplication (name) error
        // the 409 HTTP status code is for conflict error
        return res.status(409).json({
          success: false,
          message: 'Please check the form for errors:',
          errors: {
            name: 'A class with that name already exists.'
          }
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Error: Failed to process the form.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'You have successfully created a new class.'
    });
  });
};

exports.getLesson = (req,res) => {
  Lesson.findOne({ _id: req.params.id})
    .then(lesson => {
      res.json({
        lesson
      })
    });
};

exports.updateLesson = (req, res) => {
  const validationResult = validateLessonForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }
  // make sure the date formatting is universal
  const dateFormat = "DD/MM/YYYY";
  const lessonData = {
    date: moment(req.body.date.trim(), dateFormat).format("DD/MM/YYYY"),
    startTime: req.body.startTime.trim(),
    endTime: req.body.endTime.trim(),
    approved: true
  }
  Lesson.findOneAndUpdate({ _id: req.params.id }, lessonData, {
    new: true // returns new class
  })
  .then(lesson => {
    res.status(200).json({
      lesson,
      message: "You have successfully updated the class."
    })
  });
};

exports.deleteLesson = function(req, res){
	Lesson.findByIdAndRemove({_id: req.params.id},
    function(err){
    	if(err) {
        res.status(400).json({
          success: false,
          message: 'Failed to remove class.'
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'You have successfully deleted the class.'
        });
      };
    });
};
