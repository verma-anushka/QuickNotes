var passport               = require("passport"),
LocalStrategy          = require("passport-local"),
passportLocalMongoose  = require("passport-local-mongoose");
var middlewareObj = {};

middlewareObj.isAuthenticated = function(req, res, next){

    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in!" );
    res.redirect("/");
};

// // middleware
// middlewareObj.isLoggedIn = function(req, res, next){

//     if(req.isAuthenticated()){
//         // console.log("logged in");
//         return next();
//     }
//     req.flash("error", "You need to be logged in!" );
//     res.redirect("/login");
// }

module.exports = middlewareObj;
