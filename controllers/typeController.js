const Type = require('mongoose').model('Type');

function validateTypesForm(payload) {
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
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

exports.postTypes = (req, res) => {
  const validationResult = validateTypesForm(req.body);
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
  newType.save();
};
