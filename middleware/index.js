var passport               = require("passport"),
    LocalStrategy          = require("passport-local"),
    passportLocalMongoose  = require("passport-local-mongoose");

var middlewareObj = {};

// Check if user is allowed to access a page (Logged in)
middlewareObj.isAuthenticated = function(req, res, next){

    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in!" );
    res.redirect("/");
};

module.exports = middlewareObj;
