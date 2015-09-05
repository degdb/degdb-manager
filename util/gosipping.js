var config = require('../config.json');
var fs = require("fs");

var peers = [];

var addPeer = function (server) {
    console.log("removing " + server);
    peers.push(server);
}

var removePeer = function (server) {
    // TODO: remove peer
}

module.exports = {

    init: function (express) {
        var swim = require('express-swim');

        var swimApp = swim(config.externalHost + ":" + config.externalPort, {verbose: true});
        express.use('/swim', swimApp);

        swimApp.swim.on('join', addPeer);
        swimApp.swim.on('leave', removePeer);
        swimApp.swim.on('fail', removePeer);
    },

    getPeer: function () {
        return peers;
    }

}