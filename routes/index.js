var express = require('express');
var router = express.Router();

//=====================================================================================
router.get('/', function (req, res, next) {

    if (req.session.logged)//check if i logged in to allow only one user each session
    {
        res.redirect('/main')
    }
    else
    {
        res.render('index', {title: 'Welcome', message: '', form: "welcomeForm.ejs"});
    }
});

//=====================================================================================
router.post('/', function (req, res, next) {
    if(req.session.logged)//check if i logged in to allow only one user each session
    {
        res.redirect('/main')
    }
    res.render('index', {title: 'Welcome',message:'',form: "welcomeForm.ejs"});
});

module.exports = router;