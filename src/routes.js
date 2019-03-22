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
    console.log('Authorization Endpoint Hit!');
    var authCode = req.query.code;
    if (authCode) {
      
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

    loginCheck(req, res);
    
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
    console.log('Logout endpoint called!');
    req.session.destroy();
    res.redirect('/');
});


//SET Routes here
router.get("/", function (req, res) {
    console.log("Root page hit!");
    res.send(pages.loginPage(authHelper.getAuthUrl()));
    console.log('User Name at Root : ', req.cookies.graph_user_name);
});

router.get("/home", function (req, res) {
    loginCheck(req, res);
    res.sendFile(viewPath + '/index.html');
});

router.get("/about", function (req, res) {
    loginCheck(req, res);
    res.sendFile(viewPath + '/about.html');
});

router.get("/events", function (req, res) {
    loginCheck(req, res);
    res.sendFile(viewPath + '/events.html');
});

router.get("/contact", function (req, res) {
    loginCheck(req, res);
    res.sendFile(viewPath + '/contact.html');
});




function tokenReceived(req, res, error, token) {
    if (error) {
        console.log('ERROR getting token:'  + error);
        res.send('ERROR getting token: ' + error);
    }
else {
    // save tokens in session
        console.log('Incoming Token : ' + JSON.stringify(token))
        req.session.access_token = token.token.access_token;
        req.session.refresh_token = token.token.refresh_token;
        req.session.email = authHelper.getEmailFromIdToken(token.token.id_token);
        res.redirect('/logincomplete');
    }
}

function loginCheck(req, res){
    console.log('Session Data : ' + JSON.stringify(req.session.email));
    if (req.session.access_token === undefined || req.session.refresh_token === undefined) {
        console.log('/ called while not logged in');
        res.redirect('/');
        // return;
    }
  
}

module.exports = router;