var express = require('express');
var router = express.Router();
//if user not connected go to login page
router.get('/',function (req,res){
    if(req.session.logged)
        res.render('main', {userName:req.session.userName, email:req.session.email});
    else res.redirect('/login');
});

router.post('/', function (req, res, next) {
    if( req.session.logOut) res.redirect('/login');
    req.session.logged=true;
    req.session.logOut=false;
    req.session.email=req.body.email.toLowerCase();
    req.session.password=req.body.password;
    req.session.userName=req.body.userName;
    res.render('main', {userName:req.session.userName, email:req.body.email});
});

router.post('/logout', function (req, res) {
    req.session.logged = false;
    req.session.logOut = true;
    res.redirect('/login');
});

module.exports = router;