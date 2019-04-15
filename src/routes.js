const express = require("express"),
    router = express.Router(),
    path = require('path'),
    fs = require('fs');
var request = require("request");
var pages = require('./handlers/pages');
var authHelper = require('./handlers/authHelper');
const { connection } = require('./handlers/vml_db')

var dbcrud_admin = require('./handlers/admin_create_event.js')
var dbcrud_user = require('./handlers/user_registration_event.js')
var dboperation_admin = new dbcrud_admin()
var dboperation_user = new dbcrud_user()

require('dotenv').config();
//Import Environment Variables if any

const viewPath = path.join(__dirname, '../views');
//Configure paths

router.get('/authorize', function (req, res) {
    console.log('Authorization Endpoint Hit!');
    var authCode = req.query.code;
    if (authCode) {
        console.log('Retrieved auth code in /authorize: ' + authCode);
        authHelper.getTokenFromCode(authCode, tokenReceived, req, res);
    } else {
        // redirect to home
        console.log('/authorize called without a code parameter, redirecting to login');
        res.redirect('/');
    }
});

router.get('/logincomplete', function (req, res) {
    console.log('login completed successfully');

    loginCheck(req, res);

    res.sendFile(viewPath + '/index.html');
});

router.get('/refreshtokens', function (req, res) {
    var refresh_token = req.session.refresh_token;
    if (refresh_token === undefined) {
        console.log('no refresh token in session');
        res.redirect('/');
    } else {
        authHelper.getTokenFromRefreshToken(refresh_token, tokenReceived, req, res);
    }
});

router.get('/logout', function (req, res) {
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

//on click create event button by admin
router.get("/create_events", function (req, res) {
    loginCheck(req, res);
    res.sendFile(viewPath + '/admin_create_event.html');
});

//on click add button by admin 
router.post("/add_event", function (req, res) {
    dboperation_admin.add_event_by_admin(req.body.event_name, req.body.activity, req.body.work, req.body.location, req.body.hexa_association, req.body.pre_vol_activities, req.body.testimonials, req.body.links, (err, data) => {
        if (err) {
            res.send(JSON.stringify({ error: err, status:400 }));
        } else {
            res.send(JSON.stringify({ result: data, status:200 }));
        }
    })
    //res.sendFile(viewPath + '/events.html');
});

//on click button delete by admin
router.delete("/delete_event", function (req, res) {
    dboperation_admin.delete_event_by_admin(req.body.event_name, (err, data) => {
        if (err) {
            res.send(JSON.stringify({ error: err, status:400 }));
        } else {
            res.send(JSON.stringify({ result: data, status:200 }));
        }
    })
    //res.sendFile(viewPath + '/events.html');
});

//on click edit button by admin
router.put("/update_event", function (req, res) {
    dboperation_admin.update_event_by_admin(req.body.event_name, req.body.activity, req.body.work, req.body.location, req.body.hexa_association, req.body.pre_vol_activities, req.body.testimonials, req.body.links, (err, data) => {
        if (err) {
            res.send(JSON.stringify({ error: err, status:400 }));
        } else {
            res.send(JSON.stringify({ result: data, status:200 }));
        }
    })
    // res.sendFile(viewPath + '/events.html');
});

//on click add attended
router.post("/attendedToEvent", function (req, res) {
    dboperation_admin.attended_list(req.body.emp_name, req.body.event_name, req.body.email, (err, data) => {
        if (err) {
            res.send(JSON.stringify({ error: err, status:400 }));
        } else {
            res.send(JSON.stringify({ result: data, status:200 }));
        }
    })
    // res.sendFile(viewPath + '/events.html');
});

//on click register button by user
router.post("/register_event", function (req, res) {
    dboperation_user.register_event(req.body.emp_name, req.body.emp_id, req.body.contact_no, req.body.email, req.body.event_name, req.body.event_time, (err, data) => {
        if (err) {
            res.send(JSON.stringify({ error: err, status:400 }));
        } else {
            res.send(JSON.stringify({ result: data, status:200 }));
        }
    })
    // res.sendFile(viewPath + '/events.html');
});

//on click delete button by user, delete reg_event by id
router.delete("/del_regi_event", function (req, res) {
    dboperation_user.del_registration_by_user(req.body.event_name, (err, data) => {
        if (err) {
            res.send(JSON.stringify({ error: err, status:400 }));
        } else {
            res.send(JSON.stringify({ result: data, status:200 }));
        }
    })
    // res.sendFile(viewPath + '/events.html');
});

//on click edit registration button by user update time
router.put("/update_event_time", function (req, res) {
    dboperation_user.editSlots_by_user(req.body.event_name, req.body.updated_time, (err, data) => {
        if (err) {
            res.send(JSON.stringify({ error: err, status:400 }));
        } else {
            res.send(JSON.stringify({ result: data, status:200 }));
        }
    })
    // res.sendFile(viewPath + '/events.html');
});


function tokenReceived(req, res, error, token) {
    if (error) {
        console.log('ERROR getting token:' + error);
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

function loginCheck(req, res) {
    console.log('Session Data : ' + JSON.stringify(req.session.email));
    var temp = req.session.email;
    console.log(temp)
    connection.connect().then(function () {
        connection.query("SELECT * FROM admin WHERE email = '" + temp + "'").then(function (recordSet) {
            console.log(recordSet);
            console.log("recordSet.recordsets :", recordSet.recordsets)
            var temp2 = recordSet.recordset.length;
            console.log("temp :", temp2)
            if (temp2 > 0) {
                console.log("admin")
            } else {
                console.log("user")
            }
            connection.close();
        }).catch(function (err) {
            console.log(err);
            connection.close();
        });
    })
    if (req.session.access_token === undefined || req.session.refresh_token === undefined) {
        console.log('/ called while not logged in');
        res.redirect('/');
        // return;
    }
}

module.exports = router;