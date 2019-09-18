var express                = require("express"),
    bodyParser             = require("body-parser"),
    mongoose               = require("mongoose"),
    flash                  = require("connect-flash");
    methodOverride         = require("method-override"),
    passport               = require("passport"),
    LocalStrategy          = require("passport-local"),
    passportLocalMongoose  = require("passport-local-mongoose"),
    middleware             = require("./middleware"),
    db                     = require('./database.js'); // Connecting database
    User                   = require("./models/user");

var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "anything",
    // store: store,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next){
    res.locals.currentUser = req.user || null;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// LANDING PAGE 
// LOGOUT
app.get("/", function(req, res){
    
    // res.send("Landing Page");
    res.render("landing");
});

// SIGNUP & LOGIN
app.post("/", async function(req, res, next){

    // console.log(req.body.form);
    if (req.body.form == 'signUp'){
        
        let errors = [];
        var { username, email, password, password2 } = req.body;
        // console.log(username);
        // console.log(email);
        // console.log(password, password2);

        // PASSWORD CHECKS
        if(password != password2) {
            // console.log('Passwords do not match!')
            errors.push({text: 'Passwords do not match!'});
        }
        if(password.length < 4) {
            // console.log('Passwords must be at least 4 characters.')
            errors.push({text: 'Passwords must be at least 4 characters!'})
        }
        if(errors.length > 0){
            // console.log(errors.length)
            res.render('landing', {errors, username, email, password, password2});
        } else {
            // EMAIL & USERNAME CHECK
            var emailUser = await User.findOne({email: email});
            var usernameUser = await User.findOne({username: username});

            if(usernameUser) {
                // CHECK FOR SAME USERNAME
                // console.log('The Username is already in use :/');
                req.flash('error', 'The Username is already in use :/');
                res.redirect('/');
            }else if(emailUser) {
                // CHECK FOR SAME EMAIL
                // console.log('The Email is already in use :/')
                req.flash('error', 'The Email is already in use :/');
                res.redirect('/');
            }
            else {
                var user = new User({username: req.body.username, email: req.body.email});                
                // console.log("user in signup check else");
                // console.log(user);
                // console.log(user.username);
                // console.log(user.email);
                // console.log(user.password, user.password2);
                User.register(user, req.body.password, function(err,user){
                    if(err){
                        // console.log(err);
                        req.flash("error", err.message);            
                        res.render("landing");
                        // res.send("error");
                    }
                    passport.authenticate("local")(req, res, function(){
                        // console.log("user in signup check else passpoet authenticate line 169");
                        // console.log(user);
                        // console.log(user.username);
                        // console.log(user.email);
                        // console.log(user.password, user.password2);
                        console.log("registered");
                        req.flash("success", "Welcome to YelpCamp, " + user.username);
                        return res.redirect("/home");
                    });
                });
            }
        }
    }else{
        console.log("signup else");
        next();
    }
}, function(req, res, next){

    // console.log(req.body.form);
    if(req.body.form == 'login'){
        passport.authenticate('local', function( err, user, info) {
            if (err) { 
                // console.log(err);
                req.flash("error", err.message);            
                return res.render("landing");
            }
            if (!user) { 
                // console.log( "user" + user);     
                // console.log(user);     
                return res.redirect('/'); 
            }
            req.logIn(user, function(err) {
                if (err) { 
                    // console.log(err);
                    req.flash("error", err.message);            
                    return res.render("landing");
                }
                req.flash("success", "Successfully Logged in");            
                return res.redirect('/home');
            });
        })(req, res) 
    }else{
        console.log("login else");
        next();
    }
}, function(req, res, next){
    console.log(req.body.form);
    if(req.body.form == 'logout'){
        req.logout();
        console.log("logged out");
        req.flash("success", "Successfully Logged out");
        return res.redirect("/");
    }
}

);

// USER NOTES HOMEPAGE
app.get("/home", function(req, res){
    res.render("homepage");
});

// USER PROFILE
app.get("/profile", function(req, res){
    res.render("profile");
});

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function(){
    console.log('Server listening on port', app.get('port'));
});  