const Class = require('mongoose').model('Class');

const moment = require('moment');

// "class" is a reserved name so had to use "lesson" as the singular noun

function validateClassForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.date !== 'string' || payload.date.trim().length === 0) {
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

exports.getClasses = (req,res) => {
  Class.find()
    .then(classes => {
      res.json({
        classes,
        message: "The classes list has been successfully loaded."
      })
    })
};

exports.postClass = (req, res) => {
  const validationResult = validateClassForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }
  const classData = {
    name: req.body.name.trim(),
    description: req.body.description.trim(),
    image: req.body.image.trim()
  }
  const newClass = new Class(classData);
  newClass.save((err) => {
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

exports.getClass = (req,res) => {
  Class.findOne({ _id: req.params.id})
    .then(lesson => {
      res.json({
        lesson
      })
    });
};

exports.updateClass = (req, res) => {
  const validationResult = validateClassForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }
  const classData = {
    name: req.body.name.trim(),
    description: req.body.description.trim(),
    image: req.body.image.trim()
  }

  Class.findOneAndUpdate({ _id: req.params.id }, classData, {
    new: true // returns new class
  })
  .then(lesson => {
    res.status(200).json({
      lesson,
      message: "You have successfully updated the class."
    })
  });
};

exports.deleteClass = function(req, res){
	Class.findByIdAndRemove({_id: req.params.id},
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
