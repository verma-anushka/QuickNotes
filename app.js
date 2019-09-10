var express                = require("express"),
    bodyParser             = require("body-parser"),
    mongoose               = require("mongoose"),
    session                = require('express-session'),
    flash                  = require("connect-flash");
    methodOverride         = require("method-override"),
    passport               = require("passport"),
    LocalStrategy          = require("passport-local"),
    passportLocalMongoose  = require("passport-local-mongoose"),
    User                   = require("./models/user");

// Connecting database
var db = require('./database.js');

var app = express();

app.use(flash());

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "anything",
    resave: false,
    saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

app.use(function(req, res, next){
    res.locals.currentUser = req.user || null;
    // res.locals.error = req.flash("error");
    // res.locals.success = req.flash("success");
    next();
});

app.get("/", function(req, res){
    res.render("landing.ejs");
    // res.send("Landing Page");
});

app.post("/", function(req, res){
    // res.send("signup");
    var newUser = new User({username: req.body.username, email: req.body.email});
    User.register(newUser, req.body.password, function(err,user){
        if(err){
            console.log(err);
            // req.flash("error", err.message);            
            // return res.render("register");
            res.send("error");
        }
        passport.authenticate("local")(req, res, function(){
            // console.log("signup logged in");
            // req.flash("error", "Welcome to YelpCamp, " + user.username);
            res.redirect("/home");
        });
    });
});


app.get("/home", function(req, res){
    res.render("homepage.ejs");
});

app.get("/profile", function(req, res){
    res.render("profile.ejs");
});

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function(){
    console.log('Server listening on port', app.get('port'));
});
  
// app.listen(app.get('port'), () => {
//     console.log('Server on port', app.get('port'));
// });
  