var express = require('express');
var router = express.Router();
var config = require('../config.json');
var Promise = require('promise');
var request = require('request');

// useful things
var queryRoot = config.server_prefix + "/api/v1/query?q=";
var englishFilter = function(thing) { return thing.lang === "en" };


router.get('/getAllNodes', function (req, res, next) {
    var nodes = null;
    request.get(config.server_prefix + "/api/v1/peers", function optionalCallback(err, httpResponse, body) {
        nodes = JSON.parse(body);
        var promises = [];
        nodes.forEach(function (nodeMod) {
            var remoteHost = "http://" + nodeMod.Name + ":8080/api/v1/status";
            promises.push(new Promise(function (resolve, reject) {
                request.get(remoteHost, function (err1, httpResponse1, body1) {
                    if (err1) return reject(err1);

                    var tripleCount = JSON.parse(body1).triple_count;

                    // normalize to 0
                    if (tripleCount == undefined)
                    {
                        tripleCount = 0;
                    }

                    nodeMod.tripleCount = tripleCount;
                    resolve(null);
                });
            }));
        });
        Promise.all(promises).then(function () {
            res.send({"nodes": nodes });
        }).then(null, function (err) {
            next(err);
        });
    });
});

router.get('/queryByName', function (req, res, next) {

    if (!req.query.name)
    {
        res.status(400).send("name not specified");
        return;
    }

    var promise1, promise2;
    var objectId = '';
    var done = false;

    // 1st request to get the
    promise1 = new Promise(function(resolve, reject) {
        request.get(queryRoot + 'Filter("/type/object/name"=="'+encodeURIComponent(req.query.name)+'")', function(err, httpResponse, body) {
            if (err)
            {
                reject(err);
            }
            else
            {
                resolve(JSON.parse(body));
            }
        })
    });

    // 2nd request to get all the data
    promise2 = promise1.then(function(data) {

        data = data.filter(englishFilter);

        if (data.length <= 0)
        {
            // return empty set.. let the UI deal
            res.send({});
            done = true;
            return;
        }

        objectId = data[0].subj;
        var url = queryRoot + 'Id("'+objectId+'").All().Preds("name", "description")';

        return new Promise(function(resolve, reject) {
            request.get(url, function(err, httpResponse, body) {
                if (err)
                {
                    reject(err);
                }
                else
                {
                    resolve(JSON.parse(body));
                }
            });
        });
    });

    if (done)
    {
        return;
    }

    promise2.then( function(data) {

        var out = {
            root: {
                id: objectId
            },
            links: {}
        };

        for (var i = 0; i < data.length; i++)
        {
            var triple = data[i];

            if (!englishFilter(triple))
                continue;

            if (objectId == triple.subj)
            {
                console.log("root " + i);
                if (triple.pred === "https://www.googleapis.com/freebase/v1/rdf/type/object/name")
                    out.root.name = triple.obj;
                else if (triple.pred === "https://www.googleapis.com/freebase/v1/rdf/common/topic/description")
                    out.root.description = triple.obj
            }
            else
            {

                if (!out.links[triple.subj])
                {
                    out.links[triple.subj] = {};
                }

                var obj = out.links[triple.subj];
                obj.id = triple.subj;
                if (triple.pred === "https://www.googleapis.com/freebase/v1/rdf/type/object/name")
                    obj.name = triple.obj;
                else if (triple.pred === "https://www.googleapis.com/freebase/v1/rdf/common/topic/description")
                    obj.description = triple.obj
            }
        }

        res.send(out);
    });
});

function setData(obj, triple)
{
    if (triple.pred === "https://www.googleapis.com/freebase/v1/rdf/type/object/name")
        obj.name = triple.obj;
    else if (triple.pred === "https://www.googleapis.com/freebase/v1/rdf/common/topic/description")
        obj.description = triple.obj
    else
        obj['triple.pred'] = triple.obj;
}

module.exports = router;
