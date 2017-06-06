const Location = require('mongoose').model('Location');

function validateLocationForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
      isFormValid = false;
      errors.name = 'Please provide a name.';
    }

  if (!payload || typeof payload.address !== 'string' || payload.address.trim().length === 0) {
      isFormValid = false;
      errors.address = 'Please provide an address.';
    }

  if (!payload || typeof parseInt(payload.latitude) !== 'number' || typeof parseInt(payload.longitude) !== 'number') {
      isFormValid = false;
      errors.latlon = 'The latitude and longitude of the address weren\'t loaded correctly.';
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

exports.getLocations = (req,res) => {
  Location.find()
    .then(locations => {
      res.json({
        locations,
        message: "The locations list has been successfully loaded."
      })
    })
};

exports.postLocation = (req, res) => {
  const validationResult = validateLocationForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }
  const locationData = {
    name: req.body.name.trim(),
    address: req.body.address.trim(),
    latitude: parseInt(req.body.latitude.trim()),
    longitude: parseInt(req.body.longitude.trim()),
    description: req.body.description.trim()
  }

  console.log("location data: ", locationData);
  console.log(typeof locationData.latitude);
  console.log(typeof locationData.longitude);

  const newLocation = new Location(locationData);
  newLocation.save((err) => {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // the 11000 Mongo code is for a duplication (name) error
        // the 409 HTTP status code is for conflict error
        return res.status(409).json({
          success: false,
          message: 'Please check the form for errors:',
          errors: {
            name: 'A location with that name already exists.'
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
      message: 'You have successfully created a new location.'
    });
  });
};

exports.getLocation = (req,res) => {
  Location.findOne({ _id: req.params.id})
    .then(location => {
      res.json({
        location
      })
    });
};

exports.updateLocation = (req, res) => {
  const validationResult = validateLocationForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }
  const locationData = {
    name: req.body.name.trim(),
    address: req.body.address.trim(),
    latitude: parseInt(req.body.latitude.trim()),
    longitude: parseInt(req.body.longitude.trim()),
    description: req.body.description.trim()
  }

  Location.findOneAndUpdate({ _id: req.params.id }, locationData, {
    new: true // returns new type
  })
  .then(type => {
    res.status(200).json({
      type,
      message: "You have successfully updated the location."
    })
  });
};

exports.deleteLocation = function(req, res){
	Location.findByIdAndRemove({_id: req.params.id},
    function(err){
    	if(err) {
        res.status(400).json({
          success: false,
          message: 'Failed to remove location.'
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'You have successfully deleted the location.'
        });
      };
    });
};
