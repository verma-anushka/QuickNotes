var middlewareObj = {};

middlewareObj.isAuthenticated = function(req, res, next){

    if (req.isAuthenticated()) {
        return next();
    }
    
    // req.flash('error_msg', 'Not Authorized.');
    // req.flash("error", "You need to be logged in!" );
    res.redirect("/");

};

module.exports = middlewareObj;
