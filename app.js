var express                = require("express"),
    bodyParser             = require("body-parser"),
    // mongoose               = require("mongoose"),
    flash                  = require("connect-flash");
    // methodOverride         = require("method-override"),
    // passport               = require("passport"),
    // LocalStrategy          = require("passport-local"),
    // passportLocalMongoose  = require("passport-local-mongoose"),

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");
app.use(flash());

// mongoose.connect("mongodb://localhost:27017/YelpCamp", { useNewUrlParser: true });

// app.use(methodOverride("_method"));
// app.use(flash());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    // res.locals.error = req.flash("error");
    // res.locals.success = req.flash("success");
    next();
});

app.get("/", function(req, res){
    res.render("landing.ejs");
    // res.send("Landing Page");
});

app.get("/home", function(req, res){
    res.render("homepage.ejs");
});

app.get("/profile", function(req, res){
    res.render("profile.ejs");
});

app.listen(3000, function(){
    console.log("Server started");
});