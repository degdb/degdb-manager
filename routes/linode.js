var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var session = require('express-session');

/* GET users listing. */
router.get('/authenticate', function(req, res, next) {
    var linode_key = req.body.linode_key;
    req.session.linode_key = linode_key;
    if (linode_key) {

    }
});

module.exports = router;
