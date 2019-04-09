'use strict'

var os = require('os');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var routes = require('./src/routes');
// var dash = require('appmetrics-dash');
// var appMetrics = require('appmetrics');
const viewPath = path.join(__dirname, 'views');

var scribe = require('scribe-js')(),
    app    = express();

app.use('/logs', scribe.webPanel());

require('dotenv').config()


app.use(morgan('common'));
app.use(scribe.express.logger());

var port = process.env.PORT || 5000;
app.use(cookieParser());
app.use(session(
    { secret: '0dc529ba-5051-4cd6-8b67-c9a901bb8bdf',
    resave: false,
    saveUninitialized: false
    }));
app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json({
    limit: "50mb"
}))

var console = process.console;

// With log(...)
// console.log("Hello World!");
// console.info("Hello World!");
// console.error("Hello World!");
// console.warning("Hello World!");


app.use("/", routes);

app.listen(port, () => console.log('Express Server Now Running On ' + port));

