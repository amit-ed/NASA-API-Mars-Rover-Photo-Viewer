var express = require('express');

var router = express.Router();
const db = require('../models');
// Getting a single resource
//router to add image to the data base for user
router.post('/addImage', function (req,
                                   res) {
    if (!req.session.logged) res.json({emailLogged: false});//if user is logged out return
    else {
        const url = req.body.url, imageID = req.body.id, sol = req.body.sol, earthDate = req.body.earthDate,
            camera = req.body.camera, email = req.body.email;
        db.Image.create({url, imageID, sol, earthDate, camera, email})//add mage to DB
            .then(res.json({emailLogged: true}))//return true for succsesful add
            .catch((err) => {
                console.log('*** error creating a contact', JSON.stringify(err))
                res.status(400).send(err)
            })
    }
});
//======================================================================
//return all image the user saved over previous sessions
router.get('/getImages', function (req,
                                   res) {
    const email = req.session.email;
    db.Image.findAll({where: {email: email}})
        .then(userImages => {
            res.json(userImages);//return all user images
        })
        .catch((err) => {
            res.json(false);
        });
});
//===========================================================
//delete al user images
router.post('/deleteImage/:id', function (req, res, next) {
    if (!req.session.logged) res.redirect('/main');
    else{
        const imageID = parseInt(req.params.id);
        const email = req.session.email;
        db.Image.findOne({where: {imageID: imageID, email: email}})
            .then((image) => image.destroy({force: true}))//delete image from list
            .then(() => {
                res.redirect('/main')
            })//return to user's page
            .catch((err) => {
                console.log('***Error deleting contact', JSON.stringify(err))
            })
    }
});
//================================================================================
//For dev use find and present all users (with all of their info)
router.get('/findall', (req, res) => {
    return db.User.findAll()
        .then((alldata) =>
        {
            res.send(alldata)
        })
        .catch((err) => {
            console.log('error', JSON.stringify(err))
            return res.send({message: err})
        });
});
//================================================================================
//remove all images from user's list, works the same as previous func
router.get('/removeall', function (req, res, next) {
    if (!req.session.logged) res.redirect('/main');
    else{
        db.Image.findAll({where: {email: req.session.email}})
            .then(alldata => {
                alldata.forEach(data => {
                    data.destroy().catch(err => console.log("could not delete the image from database" + JSON.stringify(err)))
                })
                res.redirect('/main');
            })
            .catch((err) => {
                console.log('*** error creating a contact', JSON.stringify(err))
                res.status(400).send(err)
            })
    }
});
//===============================================================
router.get('/deleteImage/:id', function (req, res, next) {
    res.redirect("/");
});
//=================================================================
router.get('/addImage', function (req, res, next) {
    res.redirect("/");
});

module.exports = router;