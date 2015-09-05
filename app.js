var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var uuid = require('node-uuid');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  genid: function(req) {
      var buffer = new Array(32);
      return uuid.unparse(buffer); // use UUIDs for session IDs
  },
  secret: 'keyboard cat'
}));

// setup gossip/SWIM engine
//require("./util/gosipping").init(app); // TODO: fix after tristan wakes up

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// pages
app.use('/', require('./routes/pages'));
app.use('/', require('./routes/linode'));
app.use('/rest/degdb', require('./routes/degdb'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
