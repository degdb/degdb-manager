var express = require('express');
var router = express.Router();
var config = require('../config.json');
var Promise = require('promise');
var request = require('request');

fetchLoc = config.server_prefix + "/api/v1/peers";

router.get('/getAllNodes', function (req, res, next) {
    var nodes = null;
    request.get(fetchLoc, function optionalCallback(err, httpResponse, body) {
        console.log(err);
        nodes = JSON.parse(body);
        var promises = [];
        nodes.forEach(function (nodeMod) {
            var remoteHost = "http://" + nodeMod.Name + ":8080/api/v1/status";
            promises.push(new Promise(function (resolve, reject) {
                request.get(remoteHost, function (err1, httpResponse1, body1) {
                    if (err1) return reject(err1);
                    var tripleCount = JSON.parse(body1).triple_count;
                    nodeMod.tripleCount = tripleCount;
                    resolve(null);
                });
            }));
        });
        Promise.all(promises).then(function () {
            res.send({"nodes": nodes, "nodesStr": JSON.stringify(nodes)});
        }).then(null, function (err) {
            next(err);
        });
    });
});

module.exports = router;
