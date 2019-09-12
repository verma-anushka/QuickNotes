var express                = require("express"),
    bodyParser             = require("body-parser"),
    mongoose               = require("mongoose"),
    // session                = require('express-session'),
    flash                  = require("connect-flash");
    methodOverride         = require("method-override"),
    passport               = require("passport"),
    LocalStrategy          = require("passport-local"),
    passportLocalMongoose  = require("passport-local-mongoose"),
    User                   = require("./models/user");

var middleware = require("./middleware");
// Connecting database
var db = require('./database.js');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
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

app.use(function(req, res, next){
    res.locals.currentUser = req.user || null;
    // res.locals.error = req.flash("error");
    // res.locals.success = req.flash("success");
    next();
});







// app.use(flash());

// // PASSPORT CONFIG
// app.use(require("express-session")({
//     secret: "anything",
//     resave: false,
//     saveUninitialized: false 
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.use(bodyParser.urlencoded({extended: true}));
// var urlencodedParser = bodyParser.urlencoded({ extended: true })
// // app.use(bodyParser.json());
// app.set("view engine", "ejs");

// app.use(express.static(__dirname + '/public'));
// app.use(methodOverride("_method"));

// app.use(function(req, res, next){
//     res.locals.currentUser = req.user || null;
//     // res.locals.error = req.flash("error");
//     // res.locals.success = req.flash("success");
//     next();
// });

app.get("/", function(req, res){
    res.render("landing.ejs");
    // res.send("Landing Page");
});

app.post("/", async function(req, res, next){

    if (req.body.form == 'signUp'){
        
        console.log(req.body);
        let errors = [];
        var { username, email, password, password2 } = req.body;
        console.log(username);
        console.log(email);
        console.log(password);
        console.log(password2);
        if(password != password2) {
            console.log('Passwords do not match.')
            errors.push({text: 'Passwords do not match.'});
        }
        if(password.length < 4) {
            console.log('Passwords must be at least 4 characters.')
            errors.push({text: 'Passwords must be at least 4 characters.'})
        }
        if(errors.length > 0){
            console.log(errors.length)
            res.render('landing', {errors, username, email, password, password2});
        } else {
            // Look for email coincidence
            var emailUser = await User.findOne({email: email});
            var usernameUser = await User.findOne({username: username});

            if(usernameUser) {

                // Look for username coincidence
                console.log('The username is already in use.')
                // req.flash('error_msg', 'The Email is already in use.');
                res.redirect('/');
            }else if(emailUser) {

                // Look for email coincidence
                console.log('The Email is already in use.')
                // req.flash('error_msg', 'The Email is already in use.');
                res.redirect('/');
            }
            else {
                var newUser = new User({username: req.body.username, email: req.body.email});
                console.log(newUser);
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
                        console.log("registered");
                        res.redirect("/");
                    });
                });
            }
        }
    }else{
        next();
    }
}, function(req, res, next){

    if(req.body.form == 'login'){
        console.log("fygtytffugikufui");
        passport.authenticate('local', function(err, user, info) {
            console.log("login");
            // console.log("req.body");
            // console.log(req.body);

            // console.log(req.body.loginusername);
            // console.log(req.body.loginpassword);

            console.log("error");
            console.log(err);
            console.log("user");
            console.log(user);
            console.log("info");
            console.log(info);
        })(req, res) 
    
        }

        // passport.authenticate("local",{
        //     successRedirect: "/home",
        //     failureRedirect: "/profile"
        // })(req, res) 
    
        // }
    }

);


// passport.authenticate("local",{
//     successRedirect: "/home",
//     failureRedirect: "/profile"
// }),

// if (req.body.form == 'signUp') {
        
//     var newUser = new User({username: req.body.username, email: req.body.email});
    
//     User.register(newUser, req.body.password, function(err,user){
//         if(err){
//             console.log(err);
//             // req.flash("error", err.message);            
//             // return res.render("register");
//             res.send("error");
//         }
//         passport.authenticate("local")(req, res, function(){
//             // console.log("signup logged in");
//             // req.flash("error", "Welcome to YelpCamp, " + user.username);
//             res.redirect("/");
//         });
//     });
// }


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
  