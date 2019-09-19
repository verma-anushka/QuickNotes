require("dotenv").config()

var express                = require("express"),
    bodyParser             = require("body-parser"),
    mongoose               = require("mongoose"),
    async                  = require("async"),
    crypto                 = require("crypto"),
    nodemailer             = require("nodemailer"),
    cookieParser           = require("cookie-parser"),
    RememberMeStrategy     = require('passport-remember-me-extended').Strategy;
    flash                  = require("connect-flash"),
    methodOverride         = require("method-override"),
    passport               = require("passport"),
    LocalStrategy          = require("passport-local"),
    passportLocalMongoose  = require("passport-local-mongoose"),
    middleware             = require("./middleware"),
    db                     = require('./database.js'), // Connecting database
    User                   = require("./models/user"),
    Note                   = require("./models/notes");


var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(express.cookieParser());
app.use(express.bodyParser());

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "anything",
    // store: store,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));

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

// app.use(express.cookieParser());
// app.use(express.bodyParser());
// app.use(express.session({ secret: 'keyboard cat' }));
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(app.router);

// LANDING PAGE 
app.get("/", function(req, res){   
    // res.send("Landing Page");
    res.render("landing");
});

passport.use(new RememberMeStrategy(
    function(token, done) {
        Token.consume(token, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            return done(null, user);
        });
    },
    function(user, done) {
        var token = utils.generateToken(64);
        Token.save(token, { userId: user.id }, function(err) {
            if (err) { return done(err); }
            return done(null, token);
        });
    }
));




// AUTHENTICATION
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
            for(var i=0; i< errors.length; i++){
                req.flash('error', errors[i] );                
            }
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
                    }
                    passport.authenticate("local")(req, res, function(){
                        // console.log("user in signup check else passpoet authenticate line 169");
                        // console.log(user);
                        // console.log(user.username);
                        // console.log(user.email);
                        // console.log(user.password, user.password2);
                        console.log("registered");
                        req.flash("success", "Welcome to YelpCamp, " + user.username);
                        return res.redirect('/' + user._id + '/notes');
                    });
                });
            }
        }
    }else{
        // console.log("signup else");
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
            if (req.body.remember_me) { 

                var token = utils.generateToken(64);
                Token.save(token, { userId: req.user.id }, function(err) {
                if (err) { return done(err); }
                res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 }); // 7 days
                return next();
                });
            }
            req.logIn(user, function(err) {
                if (err) { 
                    // console.log(err);
                    req.flash("error", err.message);            
                    return res.render("landing");
                }
                req.flash("success", "Successfully Logged in!"); 
                // console.log("user");
                // console.log(user._id);
                return res.redirect('/' + user._id + '/notes');
            });
        })(req, res) 
    }else{
        // console.log("login else");
        next();
    }
}, function(req, res, next){

    // console.log(req.body.form);
    if(req.body.form == 'forgotPassword'){

        async.waterfall([

            function (done) {
                crypto.randomBytes(20, function (err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },

            function (token, done) {
                User.findOne({ email: req.body.email }, function (err, user) {
                    if (!user) {
                        req.flash('error', "Email doesn't exist!");
                        return res.redirect('/');
                    }
    
                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
                    user.save(function (err) {
                        done(err, token, user);
                    });
                });
            },

            function (token, user, done) {
                var smtpTransport = nodemailer.createTransport({
                    service: 'Gmail',
                    auth:    {
                                user: 'v.anushka786@gmail.com',
                                pass: process.env.GMAILPW
                             }
                });
                var mailOptions = {
                    to:      user.email,
                    from:    'v.anushka786@gmail.com',
                    subject: 'QuickNotes Password Reset',
                    text:    'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
                             'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                             'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                             'If you did not request this, please ignore this email; your password will remain unchanged.\n'
                };
                smtpTransport.sendMail(mailOptions, function (err) {
                    // console.log('mail sent');
                    req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                    done(err, 'done');
                });
            }
        ], function (err) {
            if (err){
                return next(err);
            }
            res.redirect('/');
        });
    
    }else{
        // console.log("forgotPassword else");
        next();
    }

},function(req, res, next){
    // console.log(req.body.form);
    if(req.body.form == 'logout'){
        req.logout();
        // console.log("logged out");
        req.flash("success", "Successfully Logged out");
        return res.redirect("/");
    }
}

);

// RESET PASSWORD 
app.get('/reset/:token', function (req, res) {

    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
            req.flash('error', 'Password reset token invalid or expired. Please try again');
            return res.redirect('/');
        }
        res.render('reset', { token: req.params.token });
    });
});

app.post('/reset/:token', function (req, res) {

    async.waterfall([
        function (done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                
                if (!user) {
                    req.flash('error', 'Password reset token invalid or expired. Please try again');
                    return res.redirect('back');
                }
                if (req.body.password === req.body.confirm) {

                    user.setPassword(req.body.password, function (err) {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;
                        user.save(function (err) {
                            req.logIn(user, function (err) {
                                done(err, user);
                            });
                        });
                    })
                } else {
                    req.flash("error", "Passwords do not match.");
                    return res.redirect('back');
                }
            });

        }, function (user, done) {

            var smtpTransport = nodemailer.createTransport({
                
                service: 'Gmail',
                auth:    {
                            user: 'v.anushka786@gmail.com',
                            pass: process.env.GMAILPW
                         }
            });

            var mailOptions = {
                to:      user.email,
                from:    'v.anushka786@mail.com',
                subject: 'Your password has been changed',
                text:    'Hello,\n\n' +
                         'This is a confirmation that the password for your account ' + user.email + ' has been changed.\n'
            };

            smtpTransport.sendMail(mailOptions, function (err) {
                // console.log("mail sent");
                req.flash('success', 'Password successfully changed!');
                done(err);
            });
        }
    ], function (err) {
        res.redirect('/' + user._id + '/notes');
    });
});

// USER NOTES HOMEPAGE
// middleware.isAuthenticated,
app.get("/:id/notes",  async function(req, res){

    Note.find({}, function(error, allNotes){
        if(error){
            console.log(error);
        }else{
            res.render("homepage", {notes:allNotes});            
        }
    });
});

// ADD NEW NOTE
// middleware.isLoggedIn,
app.post("/:id/notes", function(req,res){
    // res.send("POST Req");
    User.findById(req.params.id, function(error, user){
        if(error){
            req.flash("error", "Something went wrong!" );
            console.log(error);
        }else{           
            Note.create(req.body.note, function(error, note){
                if(error){
                    console.log(error);
                }else{
                    note.author.id = req.user._id;
                    note.author.username = req.user.username;
                    note.save();

                    user.notes.push(note);
                    user.save();
                    // console.log(comment);
                    req.flash("success", "Successfully added note!" );
                    res.redirect(user._id + "/notes/" );
                }
            });
        }
    });
});

app.get("/:id/notes/new", function(req, res){

    User.findById(req.params.id, function(error, user){
        if(error){
            console.log(error);
        }else{
            // console.log(req.params.id);
            res.render("new", {user: user});
        }
    });
});

// EDIT
//  middleware.checkNoteOwnership,
app.get("/:id/notes/:note_id/edit", function(req, res){

    Note.findById(req.params.note_id, function(error, foundNote){
        if(error){
            res.redirect("back");
        }else{
            res.render("edit", {user_id: req.params.id, note: foundNote}); 
        }
    });
   
});

// UPDATE
// middleware.checkNoteOwnership,
app.put("/:id/notes/:note_id", function(req, res){

    // req.body.blog.body = req.sanitize(req.body.blog.body);
    Note.findByIdAndUpdate(req.params.note_id, req.body.note, function(error, updatedNote){
        if(error){
            res.redirect("back");
        }else{
            req.flash("success", "Successfully updated note!" );
            res.redirect(req.params.id + "/notes/" );
        }
    });    
});

// DESTROY
// middleware.checkNoteOwnership,
app.delete("/:id/notes/:note_id", function(req, res){
    
    Note.findByIdAndRemove(req.params.note_id, function(error){
        if(error){
            res.redirect("back");
        }else{
            req.flash("success", "Note deleted!" );
            res.redirect(req.params.id + "/notes/" );
        }
    });
});

// USER PROFILE
app.get("/profile", function(req, res){
    res.render("profile");
});

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function(){
    console.log('Server listening on port', app.get('port'));
});  