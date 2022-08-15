var express = require('express');

var router = express.Router();
const db = require('../models');
//=====================================================================================
//confirm email is not used already
router.get('/checkEmail/:id', (req,
                               res) => {
    db.User.findOne({where: {email: req.params.id}})
        .then(user => {
            res.json({emailExist: user.email});//return true if email exist
        })
        .catch((err) => {
            res.json({emailExist: false});//false if not
        });
});
//=====================================================================================
//check that password and email match
router.get('/checkLogin/:email/:password', (req,
                                            res) => {
    db.User.findOne({where: {email: req.params.email}})
        .then(user => {
            if(!(user.password).localeCompare(req.params.password))//if user's password matches given password from login
            {
                req.session.logOut=false;
                res.json({userVerified: true,userName:user.firstName});//return that all matches
            }
            else
                throw("password dont match") ;
        })
        .catch((err) => {
            res.json({userVerified: false});
        });
});
//=====================================================================================

module.exports = router;