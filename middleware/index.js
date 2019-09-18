
var passport               = require("passport"),
LocalStrategy          = require("passport-local"),
passportLocalMongoose  = require("passport-local-mongoose");
var middlewareObj = {};

middlewareObj.isAuthenticated = function(req, res, next){

    if (req.isAuthenticated()) {
        return next();
    }
    
    // req.flash('error_msg', 'Not Authorized.');
    // req.flash("error", "You need to be logged in!" );
    res.redirect("/");

};

middlewareObj.isLogin = function(req, res, err, user, info, next){

    // console.log("nodc m vkxcn vkznv k");

    if(req.body.form == 'login') {
        
        console.log(req.body.form);
        passport.authenticate("local",{
            // console.log("ccd kdcd");
            successRedirect: "/home",
            failureRedirect: "/profile"
        });

        console.log("no");
        console.log("error");
        console.log(err);
        console.log("user");
        console.log(user);
        console.log("info");
        console.log(info);
        // return next();
    }

};


module.exports = middlewareObj;
