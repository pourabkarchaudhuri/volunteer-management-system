const express = require("express"),
  router = express.Router(),
  path = require('path'),
  fs = require('fs');
var request = require("request");

//Import Package Dependencies

require('dotenv').config();
//Import Environment Variables if any

const viewPath = path.join(__dirname, '../views');
//Configure paths


//SET Routes here
router.get("/", function (req, res) {
    res.sendFile(viewPath + '/index.html');
});

router.get("/home", function (req, res) {
    res.sendFile(viewPath + '/index.html');
});

router.get("/about", function (req, res) {
    res.sendFile(viewPath + '/about.html');
});




module.exports = router;