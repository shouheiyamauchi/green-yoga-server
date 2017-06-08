const User = require('mongoose').model('User');
const mongoose = require('mongoose');
const moment = require('moment');

exports.getUsers = (req,res) => {
  User.find()
    .then(users => {
      res.json({
        users,
        message: "The classes list has been successfully loaded."
      })
    })
};

exports.getUser = (req,res) => {
  User.findOne({ _id: req.params.id})
    .then(user => {
      res.json({
        user
      })
    });
};

exports.updateUser = (req, res) => {
  const validationResult = validateUserForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }
  // make sure the date formatting is universal
  const dateFormat = "DD/MM/YYYY";
  const userData = {
    date: moment(req.body.date.trim(), dateFormat).format("DD/MM/YYYY"),
    startTime: req.body.startTime.trim(),
    endTime: req.body.endTime.trim(),
    user_id: mongoose.Types.ObjectId(req.body.user_id.trim()),
    type_id: mongoose.Types.ObjectId(req.body.type_id.trim()),
    location_id: mongoose.Types.ObjectId(req.body.location_id.trim()),
    approved: true
  }
  User.findOneAndUpdate({ _id: req.params.id }, userData, {
    new: true // returns new class
  })
  .then(user => {
    res.status(200).json({
      user,
      message: "You have successfully updated the class."
    })
  });
};

exports.deleteUser = function(req, res){
	User.findByIdAndRemove({_id: req.params.id},
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
