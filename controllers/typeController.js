const Type = require('mongoose').model('Type');
const mongoose = require('mongoose')

exports.postTypes = (req, res) => {
  console.log('req: ', req)
  const typeData = {
    name: req.body.name.trim(),
    description: req.body.description.trim(),
    image: req.body.image.trim()
  }
  const newType = new Type(typeData);
  newType.save((err) => {
    if (err) { return done(err); }

    return done(null);
  });
};
