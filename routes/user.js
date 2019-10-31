// PACKAGES
var express                = require("express"),
    router                 = express.Router({mergeParams: true});
    passport               = require("passport"),
    multer                 = require('multer'),
    db                     = require('../database'),
    User                   = require("../models/user"),
    Note                   = require("../models/notes");
    middleware             = require("../middleware");

// PROFILE IMAGE
var storage = multer.diskStorage({
    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});
var imageFilter = function (req, file, cb) {
    // ACCEPT ONLY IMAGE FILES
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter});
var cloudinary = require('cloudinary');
cloudinary.config({ 
    cloud_name: "dd0evlwdl", 
    api_key: 576296943363917,
    api_secret: "6qJhRW0-qQZkkLMr_ZhI0a4SQaE"
});

// USER PROFILE
router.get("/:id/profile", middleware.isAuthenticated, function(req, res){

    User.findById(req.params.id, function(error, foundUser){
        if(error){
            console.log(error);
            req.flash("error", "Something went wrong!" );
            res.redirect("back");
        }else{
            res.render("profile", {user: foundUser});            
        }
    });
});

// USER PROFILE IMAGE
router.post("/:id/profile/profileImg", middleware.isAuthenticated, upload.single('image'), function(req,res){
    
    User.findById(req.params.id, async function(error, user){
        if(error){
            console.log(error);
            req.flash("error", "Something went wrong!" );
            res.redirect("back");
        }else{
            if(req.file){
                try{
                    var result = await cloudinary.v2.uploader.upload(req.file.path);
                    user.imageId = result.public_id;
                    user.image = result.secure_url;
                }catch(err){
                    console.log(err);
                    req.flash("error", "Something went wrong!" );
                    return res.redirect("back");
                }
            }
        }

        // SAVING USER INPUTS
        if(req.body.user.firstName.length > 0)
            user.firstName = req.body.user.firstName;
        if(req.body.user.lastName.length > 0)
            user.lastName = req.body.user.lastName;
        // if(req.body.user.gender.length > 0)
            user.gender = req.body.user.gender;
        if(req.body.user.contact.length > 0)
            user.contact = req.body.user.contact;
        if(req.body.user.bio.length > 0)
            user.bio = req.body.user.bio;
        // console.log(req.body);
        
        user.save();
        req.flash("success", "Successfully Updated!" );
        res.redirect('/' + req.params.id + "/profile");
    });
});

module.exports = router;