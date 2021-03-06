const Type = require('mongoose').model('Type');

function validateTypeForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
      isFormValid = false;
      errors.name = 'Please provide a name.';
    }

  if (!payload || typeof payload.description !== 'string' || payload.description.trim().length === 0) {
      isFormValid = false;
      errors.description = 'Please provide a description.';
    }

  if (!payload || typeof payload.image !== 'string' || payload.image.trim().length === 0) {
      isFormValid = false;
      errors.image = 'Please provide an image.';
    }

  if (!isFormValid) {
    message = 'Please check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

exports.getTypes = (req,res) => {
  Type.find()
    .then(types => {
      res.json({
        types,
        message: "The class types list has been successfully loaded."
      })
    })
};

exports.postType = (req, res) => {
  const validationResult = validateTypeForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }
  const typeData = {
    name: req.body.name.trim(),
    description: req.body.description.trim(),
    image: req.body.image.trim()
  }
  const newType = new Type(typeData);
  newType.save((err) => {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // the 11000 Mongo code is for a duplication (name) error
        // the 409 HTTP status code is for conflict error
        return res.status(409).json({
          success: false,
          message: 'Please check the form for errors.',
          errors: {
            name: 'A class type with that name already exists.'
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
      message: 'You have successfully created a new class type.'
    });
  });
};

exports.getType = (req,res) => {
  Type.findOne({ _id: req.params.id})
    .then(type => {
      res.json({
        type
      })
    });
};

exports.updateType = (req, res) => {
  const validationResult = validateTypeForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }
  const typeData = {
    name: req.body.name.trim(),
    description: req.body.description.trim(),
    image: req.body.image.trim()
  }

  Type.findOneAndUpdate({ _id: req.params.id }, typeData, {
    new: true // returns new type
  })
  .then(type => {
    res.status(200).json({
      type,
      message: "You have successfully updated the class type."
    })
  });
};

exports.deleteType = function(req, res){
	Type.findByIdAndRemove({_id: req.params.id},
    function(err){
    	if(err) {
        res.status(400).json({
          success: false,
          message: 'Failed to remove class type.'
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'You have successfully deleted the class type.'
        });
      };
    });
};
