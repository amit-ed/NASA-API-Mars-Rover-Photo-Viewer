var express = require('express');
const Cookies = require("cookies");
var router = express.Router();
const keys = ['keyboard cat'];
//set time for cookies while sub password
router.post('/', function (req, res, next) {
    const cookies = new Cookies(req, res, {keys: keys})//set cookie
    // Get the cookie
    cookies.set('LastVisit', new Date().toISOString(), {signed: false, maxAge: 60 * 1000});//set cookie life time
    res.render('index', {
        title: 'Set Password',message: '',form: "passwordForm.ejs", email: req.body.email.toLowerCase().trim(), firstname: req.body.firstname.trim(),
        lastname: req.body.lastname.trim()
    });
});
//===================================================
//for each page to return to nasa page if connected
router.get('/', function (req, res, next) {
    res.redirect('/');
});

module.exports = router;