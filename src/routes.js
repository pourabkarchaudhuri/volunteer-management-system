const express = require("express"),
  router = express.Router(),
  path = require('path'),
  fs = require('fs');
var request = require("request");

var pages = require('./handlers/pages');
var authHelper = require('./handlers/authHelper');
// var config = require("../config");

//Import Package Dependencies

require('dotenv').config();
//Import Environment Variables if any

const viewPath = path.join(__dirname, '../views');
//Configure paths

router.get('/authorize', function(req, res) {
    var authCode = req.query.code;
    if (authCode) {
      console.log('');
      console.log('Retrieved auth code in /authorize: ' + authCode);
      authHelper.getTokenFromCode(authCode, tokenReceived, req, res);
    }
    else {
      // redirect to home
      console.log('/authorize called without a code parameter, redirecting to login');
      res.redirect('/');
    }
});

router.get('/logincomplete', function(req, res) {
    console.log('login completed successfully');
    var access_token = req.session.access_token;
    var refresh_token = req.session.access_token;
    var email = req.session.email;
    console.log("EMAIL : " + email)

    if (access_token === undefined || refresh_token === undefined) {
        console.log('/logincomplete called while not logged in');
        res.redirect('/');
        return;
    }
    res.sendFile(viewPath + '/index.html');
});

router.get('/refreshtokens', function(req, res) {
    var refresh_token = req.session.refresh_token;
    if (refresh_token === undefined) {
      console.log('no refresh token in session');
      res.redirect('/');
    }
    else {
      authHelper.getTokenFromRefreshToken(refresh_token, tokenReceived, req, res);
    }
});

router.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});


//SET Routes here
router.get("/", function (req, res) {
    console.log("Root page hit!");
    res.send(pages.loginPage(authHelper.getAuthUrl()));
});

router.get("/home", function (req, res) {
    res.sendFile(viewPath + '/index.html');
});

router.get("/about", function (req, res) {
    res.sendFile(viewPath + '/about.html');
});

router.get("/events", function (req, res) {
    res.sendFile(viewPath + '/events.html');
});

router.get("/contact", function (req, res) {
    res.sendFile(viewPath + '/contact.html');
});




function tokenReceived(req, res, error, token) {
    if (error) {
        console.log('ERROR getting token:'  + error);
        res.send('ERROR getting token: ' + error);
    }
else {
    // save tokens in session
        req.session.access_token = token.token.access_token;
        req.session.refresh_token = token.token.refresh_token;
        req.session.email = authHelper.getEmailFromIdToken(token.token.id_token);
        res.redirect('/logincomplete');
    }
}

module.exports = router;