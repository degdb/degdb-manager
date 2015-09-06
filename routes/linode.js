var express    = require('express');
var router     = express.Router();
var bodyParser = require("body-parser");
var session    = require('express-session');
var linode = require('linode-api');


function callLinodeClient(client, endpoint, data)
{
    // verify data isnt null to avoid NPE
    if (!data)
    {
        data = {};
    }
    return new Promise(function (resolve, reject) {

        client.call(endpoint, data, function (err, resp) {
            if (err)
            {
                reject(err);
            }
            else
            {
                resolve(resp);
            }
        });

    });
}

function callLinode(key, endpoint, data)
{
    var client = new(linode.LinodeClient)(key);
    return callLinodeClient(client, endpoint, data);
}

router.get('/manage', function (req, res, next) {
    res.render("manager", { has_key: !!req.session.linode_key } );
});

router.post('/authenticate', function (req, res, next) {
    callLinode(req.body.linode_key, 'test.echo').then( function() {
        req.session.linode_key = linode_key; // on success
    });

    res.redirect("/manage"); // regardless of success or failure
});

router.get("/authenticate", function (req, res, next) {
    res.redirect("/");
});

router.get("/linode/listNodes", function (req, res, next) {
    if (!req.session.linode_key)
    {
        res.sendStatus(403); // forbidden
    }
    else
    {
        callLinode(req.body.linode_key, 'linode.list').then( function(data) {
            res.send({ data: data.DATA });
        });
    }
});

// NODE CREATION
var statuses = {};
var key = 1;

router.get("/linode/createNode", function (req, res, next) {

    if (!req.session.linode_key)
    {
        res.status(403).end(); // forbidden
        return;
    }

    // set defaults
    var nodeCreate = {
        DatacenterId: 6,
        PlanId: 1
    }
    var diskCreate = {
        StackScriptID: 13073, // hardcoded our special one
        StackScriptUDFResponses: "", // nothing needed here
        DistributionID: 129, // centos
        Size: 10240, // 10GB minimum for centos
    }

    if (!req.body.label)
    {
        res.status(400).send('No Label');
        return;
    }
    else if (!req.body.rootPass)
    {
        res.status(400).send('No root pass');
        return;
    }
    else
    {
        diskCreate.Label = req.body.label;
        diskCreate.rootPass = req.body.rootPass;
        // TODO: SSH key
    }

    // reply
    res.status(201).end(); // 201 accepted.. stuff ongoing...
    // then

    // START THE ASYNC!
    var queryId = "" + (key++);
    var client = new(linode.LinodeClient)(req.session.linode_key);
    statuses[queryId] = { done: false, message: "Creating linode instance"};

    callLinodeClient(client, "linode.create", nodeCreate).then( function(data) {
        statuses[queryId] = { done: false, message: "Preparing disk image"};
        diskCreate.LinodeId = data.DATA.LinodeId;
        return callLinodeClient(client, "linode.disk.createfromstackscript", diskCreate);
    }).then(function(data) {
        statuses[queryId] = { done: false, message: "Booting image"};
        return callLinodeClient(client, "linode.boot", { LinodeId: diskCreate.LinodeId });
    });
});

router.get("/linode/createNode/status/:key", function (req, res, next) {
    var check = "" + req.param.key;
    var status = statuses[check];

    if (status)
    {
        res.send(status);
        if (status.done)
        {
            statuses[check] = undefined;
        }
    }
    else
    {
        res.status(404).send("No such status id");
    }
});

module.exports = router;
