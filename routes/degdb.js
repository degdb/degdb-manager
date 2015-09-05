var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/4edd', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
