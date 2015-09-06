var express    = require('express');
var router     = express.Router();
var request    = require('request');
var bodyParser = require("body-parser");
var session    = require('express-session');
var config     = require('../config.json');
var Promise    = require('promise');


fetchLoc = config.server_prefix + "/api/v1/peers";
router.get('/manage', function (req, res, next) {
    var nodes = null;
    request.get(fetchLoc, function optionalCallback(err, httpResponse, body) {
        nodes = JSON.parse(body);
        var promises = [];
        nodes.forEach(function (nodeMod) {
            var remoteHost = "http://" + nodeMod.Name + ":8080/api/v1/status";
            promises.push(new Promise(function (resolve, reject) {
                request.get(remoteHost, function(err1, httpResponse1, body1) {
                    if (err1) return reject(err1);
                    var tripleCount = JSON.parse(body1).triple_count;
                    nodeMod.tripleCount = tripleCount;
                    resolve(null);
                });
            }));
        });
        Promise.all(promises).then(function () {
            if (req.session.linode_key) {
                res.render("manager", {"nodes": nodes, "nodesStr": JSON.stringify(nodes)});
            }
            else {
                res.render("pretty-error", {"error": "You must be authenticated to use the manager."});
            }
        }).then(null, function (err) {
            next(err);
        });
    });
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
