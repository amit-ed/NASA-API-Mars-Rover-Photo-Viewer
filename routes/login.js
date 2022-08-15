var express = require('express');
const Cookies = require("cookies");
var router = express.Router();
const db = require('../models');
const keys = ['keyboard cat'];
//creat a new user after succsesful register
router.post('/', function (req, res, next) {
    const cookies = new Cookies(req, res, {keys: keys})//set cookies
    // Get the cookie
    const lastVisit = cookies.get('LastVisit', {signed: false})//get start time
    if (!lastVisit) {//if 60 sec didnt passed
        res.render('index', {title: 'Register',message:'session timeout, try again' ,form: "registerForm.ejs"});
    } else {//else create user
        const firstName = req.body.firstName.trim(), lastName = req.body.lastName.trim(), email = req.body.email.trim(),
            password = req.body.password.trim();
        db.User.findOrCreate({where: {email: email}, defaults: {firstName, lastName, email, password}})
            .then(([model, created]) => {
                created ? res.render('index',
                    {title: 'login',message:'register successfully',form: "loginForm.ejs"})
            : res.redirect('/register');
            })
            .catch((err) => {
                console.log('***There was an error creating a user', JSON.stringify(err))
                return res.status(400).redirect('/register');
            })
    }
});
//=====================================================================================
//for each page to return to nasa page if connected
router.get('/', function (req, res, next) {
    if(req.session.logged) res.redirect('/main');
    res.render('index',
        {title: 'login',message:'',form: "loginForm.ejs"});
});

module.exports = router;