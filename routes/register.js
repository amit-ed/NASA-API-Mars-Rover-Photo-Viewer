var express = require('express');
var router = express.Router();
//==============================================
//
router.post('/', function (req, res, next) {
    res.render('index',
        {title: 'Register',message: '',form: "registerForm.ejs"});
});
//============================================================
//
router.get('/', function (req, res, next) {
    res.redirect('/');
});

module.exports = router;