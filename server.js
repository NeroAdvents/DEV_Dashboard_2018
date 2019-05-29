var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var request = require('request');
var nodeWidget = require('node-widgets');
var fs = require('fs');

var configDB = require('./config/database.js');
mongoose.connect(configDB.url, {useNewUrlParser : true});
require('./config/passport.js')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'anystringoftext',
                saveUninitialized: true,
                resave: true}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.static('public'));

app.set('view engine', 'ejs');

require('./app/routes.js')(app, passport, request, nodeWidget, fs);

app.listen(port);
console.log('Server running on port: ' + port);