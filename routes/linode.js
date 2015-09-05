var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var session = require('express-session');

router.get('/manage', function (req, res, next) {
    if (req.session.linode_key) {
        res.render("manager");
    }
    else {
        res.render("pretty-error", {"error": "You must be authenticated to use the manager."});
    }
});

router.post('/authenticate', function (req, res, next) {
    var linode_key = req.body.linode_key;
    var client = new(require('linode-api').LinodeClient)(linode_key);
    client.call('test.echo', {msg: "hello world"}, function (err, resp) {
        if (err) {
            return res.render("pretty-error", {"error": "Invalid API key."});
        }
        else {
            req.session.linode_key = linode_key;
            return res.redirect("/manage");
        }
    });
});

router.get("/authenticate", function (req, res, next) {
    res.redirect("/");
});

module.exports = router;
