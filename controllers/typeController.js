const Type = require('mongoose').model('Type');

exports.postTypes = (req, res) => {
  console.log(req.body)
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
