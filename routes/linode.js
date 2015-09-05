var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var session = require('express-session');

router.post('/authenticate', function (req, res, next) {
    var linode_key = req.body.linode_key;
    if (linode_key) {
        req.session.linode_key = linode_key;
    }
    var client = new(require('linode-api').LinodeClient)(linode_key);
    client.call('test.echo', {msg: "hello, self!"}, function (err, resp) {
        if (err) {
            return res.render("pretty-error", {"error": "Invalid API key."});
        }
        else {
            return res.render("manage");
        }
    });
});
router.get("/authenticate", function (req, res, next) {
    res.redirect("/");
});

module.exports = router;
