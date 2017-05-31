var express = require('express');
var router = express.Router();

var json = {user: "Shouhei"}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json(json);
});

module.exports = router;
