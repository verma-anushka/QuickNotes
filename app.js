require("dotenv").config()

var express                = require("express"),
    bodyParser             = require("body-parser"),
    mongoose               = require("mongoose"),
    async                  = require("async"),
    crypto                 = require("crypto"),
    nodemailer             = require("nodemailer"),
    // cookieParser           = require("cookie-parser"),
    // RememberMeStrategy     = require('passport-remember-me-extended').Strategy;
    flash                  = require("connect-flash"),
    methodOverride         = require("method-override"),
    passport               = require("passport"),
    LocalStrategy          = require("passport-local"),
    passportLocalMongoose  = require("passport-local-mongoose"),
    multer                 = require('multer'),
    sgMail                 = require('@sendgrid/mail');
    // $                      = require("jquery"),
    middleware             = require("./middleware"),
    db                     = require('./database.js'), // Connecting database
    User                   = require("./models/user"),
    Note                   = require("./models/notes");
 
// var jsdom = require("jsdom");
// var window = jsdom.jsdom().createWindow();
// var $ = require("jquery")( window );
// var $ = require('jquery')(require("jsdom").jsdom().parentWindow);
// var jsdom = require("jsdom");
// const { JSDOM } = jsdom;
// const { window } = new JSDOM();
// const { document } = (new JSDOM('')).window;
// global.document = document;
// // var $ = require("jquery")(window);
// window.$ = require('jquery')(window);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var storage = multer.diskStorage({
    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
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

var app = express();

app.set("view engine", "ejs");
// app.set("view engine", "js");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// app.use(express.cookieParser());
// app.use(express.bodyParser());

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "anything",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// app.use(passport.authenticate('remember-me'));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next){
    res.locals.user = req.user || null;
    res.locals.note = req.note || null;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// LANDING PAGE 
app.get("/", function(req, res){   

    res.render("landing");
});

// passport.use(new RememberMeStrategy(
//     function(token, done) {
//         Token.consume(token, function (err, user) {
//             if (err) { return done(err); }
//             if (!user) { return done(null, false); }
//             return done(null, user);
//         });
//     },
//     function(user, done) {
//         var token = utils.generateToken(64);
//         Token.save(token, { userId: user.id }, function(err) {
//             if (err) { return done(err); }
//             return done(null, token);
//         });
//     }
// ));

// AUTHENTICATION
app.post("/", async function(req, res, next){

    // SIGN UP
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
        if(password && errors.length > 0){
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
                if(emailUser == ''){
                    req.flash('error', 'Please enter a valid email id! ');
                }else
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
                        req.flash("error", "Something went wrong!");            
                        res.render("landing");
                    }
                    passport.authenticate("local")(req, res, function(){
                        // console.log(user);
                        // console.log(user.username);
                        // console.log(user.email);
                        // console.log(user.password, user.password2);
                        console.log("New user registered");
                        req.flash("success", "Welcome to QuickNotes, " + user.username + "!");
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

    // LOGIN
    if(req.body.form == 'login'){

        passport.authenticate('local', function( err, user, info) {
            if (err) { 
                // console.log(err);
                req.flash("error",  "Something went wrong!");            
                return res.render("landing");
            }
            if (!user) { 
                // console.log( "user" + user);     
                // console.log(user);  
                req.flash("error", "Invalid Username!");            
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
                    req.flash("error", "Something went wrong!");            
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

    // LOGOUT
    if(req.body.form == 'logout'){
        req.logout();
        // console.log("logged out");
        req.flash("success", "Successfully Logged out!");
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
app.get("/:id/notes", middleware.isAuthenticated, async function(req, res){

    User.findById(req.params.id, function(error, user){
        if(error){
            console.log(error);
            req.flash("error", "Something went wrong! User not found!" );
        }else{
            // console.log("req.params user");
            // console.log(req.params);
            Note.find(req.params.note_id, function(error, allNotes){
                // console.log("req.params notes");
                // console.log(req.params);

                // console.log("user");
                // console.log(user);
                // console.log("notes");
                // console.log(allNotes);

                if(error){
                    req.flash("error", "Something went wrong! Notes not found!" );
                    console.log(error);
                }else{
                    res.render("homepage", {user: user, notes: allNotes});
                }
            });
        }
    });
    // Note.find({}, function(error, allNotes){
    //     if(error){
    //         console.log(error);
    //     }else{
    //         res.render("homepage", {notes:allNotes});            
    //     }
    // });
});

app.get("/:id/notes/share", function(req, res){
    var shareUser = req.query.shareUser;
    if(shareUser){
        Note.findById(req.query.shareUser.noteid, function(error, note){
            if(error){
                req.flash("error", "Something went wrong! Note not found" );                
                console.log(error);
                return res.redirect("back");
            }else{
                // console.log(note);
                var msgToReciever = {};
                var msgToUser = {};
                if(note.type === 'blank' || note.type === 'lecture'){
                    msgToReciever = {
                        to: 	 'anushkarvp1999@gmail.com',
                        from: 	 'v.anushka786@gmail.com',
                        subject: 'Notes from QuickNotes!',
                        html: 	'Hi, ' + shareUser.receiverName + '!' +
                                '<br>'	+ 
                                note.author.username + ' just shared their notes with you!' + 
                                '<br>'	+ 
                                '<h4>Notes Details!</h4>' + 
                                '<h3>' + note.title + '</h3>' + 
                                '<p>' + note.description + '</p>' + 
                                '<br>'	+ 
                                '<br>'	+ 
                                '<p>Join QuickNotes today to enjoy making notes for free!'
                    };
                    msgToUser = {
                        to: 	 'v.anushka786@gmail.com',
                        from: 	 'QuickNotes@gmail.com',
                        subject: 'Notes shared with ' + shareUser.receiverName,
                        html: 	'Hi, ' + note.author.username +
                                '<br>'	+ 
                                'Your notes have been shared with ' + shareUser.receiverName + 
                                '<br>'	+ 
                                '<h4>Notes Details!</h4>' +
                                '<h3>' + note.title + '</h3>' + 
                                '<p>' + note.description + '</p>' + 
                                '<br>'	+ 
                                '<br>'	+ 
                                '<p>Keep using QuickNotes!' 
                    };
                }else if(note.type === 'to-do'){
                    var todoList = '';
                    note.todos.forEach(function(todo){ 
                        todoList = todoList + todo;
                        todoList = todoList + '<br />';
                    });
                    msgToReciever = {
                        to: 	 'anushkarvp1999@gmail.com',
                        from: 	 'v.anushka786@gmail.com',
                        subject: 'Notes from QuickNotes!',
                        html: 	'Hi, ' + shareUser.receiverName + '!' +
                                '<br>'	+ 
                                note.author.username + ' just shared their notes with you!' + 
                                '<br>'	+ 
                                '<h4>Notes Details!</h4>' + 
                                '<h3>' + note.title + '</h3>' + 
                                '<p>' + todoList + '</p>' +
                                '<br>'	+ 
                                '<br>'	+ 
                                '<p>Join QuickNotes today to enjoy making notes for free!'
                    };
                    msgToUser = {
                        to: 	 'v.anushka786@gmail.com',
                        from: 	 'QuickNotes@gmail.com',
                        subject: 'Notes shared with ' + shareUser.receiverName,
                        html: 	'Hi, ' + note.author.username +
                                '<br>'	+ 
                                'Your notes have been shared with ' + shareUser.receiverName + 
                                '<br>'	+ 
                                '<h4>Notes Details!</h4>' +
                                '<h3>' + note.title + '</h3>' + 
                                '<p>' + todoList + '</p>' +
                                '<br>'	+ 
                                '<br>'	+ 
                                '<p>Keep using QuickNotes!</p>' 
                    };
                }else if(note.type === 'meeting'){
                    msgToReciever = {
                        to: 	 'anushkarvp1999@gmail.com',
                        from: 	 'v.anushka786@gmail.com',
                        subject: 'Notes from QuickNotes!',
                        html: 	'Hi, ' + shareUser.receiverName + '!' +
                                '<br>'	+ 
                                note.author.username + ' just shared their notes with you!' + 
                                '<br>'	+ 
                                '<h4>Notes Details!</h4>' + 
                                '<h3>' + note.title + '</h3>' + 
                                '<p>Date & Time: ' + note.meetingDate + '</p>' +
                                '<p>Agenda: ' + note.meetingAgenda + '</p>' +
                                '<p>Attendees: ' + note.meetingAttendees + '</p>' +
                                '<br>'	+ 
                                '<br>'	+ 
                                '<p>Join QuickNotes today to enjoy making notes for free!'
                    };
                    msgToUser = {
                        to: 	 'v.anushka786@gmail.com',
                        from: 	 'QuickNotes@gmail.com',
                        subject: 'Notes shared with ' + shareUser.receiverName,
                        html: 	'Hi, ' + note.author.username +
                                '<br>'	+ 
                                'Your notes have been shared with ' + shareUser.receiverName + 
                                '<br>'	+ 
                                '<h4>Notes Details!</h4>' +
                                '<h3>' + note.title + '</h3>' + 
                                '<p>Date & Time: ' + note.meetingDate + '</p>' +
                                '<p>Agenda: ' + note.meetingAgenda + '</p>' +
                                '<p>Attendees: ' + note.meetingAttendees + '</p>' +
                                '<br>'	+ 
                                '<br>'	+ 
                                '<p>Keep using QuickNotes!' 
                    };
                }else if(note.type === 'daily-reflection'){
                    msgToReciever = {
                        to: 	 'anushkarvp1999@gmail.com',
                        from: 	 'v.anushka786@gmail.com',
                        subject: 'Notes from QuickNotes!',
                        html: 	'Hi, ' + shareUser.receiverName + '!' +
                                '<br>'	+ 
                                note.author.username + ' just shared their notes with you!' + 
                                '<br>'	+ 
                                '<h4>Notes Details!</h4>' + 
                                '<h3>' + note.title + '</h3>' + 
                                '<h4>What went well today?!</h4>' +
                                '<p>' + note.dailyReflection[0] + '</p>' +
                                "<h4>What didn't go as planned?!</h4>" +
                                '<p>' + note.dailyReflection[1] + '</p>' +
                                '<h4>What can be improved upon?!</h4>' +
                                '<p>' + note.dailyReflection[2] + '</p>' +
                                "<h4>What's on your mind?!</h4>" +
                                '<p>' + note.dailyReflection[3] + '</p>' +
                                '<br>'	+ 
                                '<br>'	+ 
                                '<p>Join QuickNotes today to enjoy making notes for free!'
                    };
                    msgToUser = {
                        to: 	 'v.anushka786@gmail.com',
                        from: 	 'QuickNotes@gmail.com',
                        subject: 'Notes shared with ' + shareUser.receiverName,
                        html: 	'Hi, ' + note.author.username +
                                '<br>'	+ 
                                'Your notes have been shared with ' + shareUser.receiverName + 
                                '<br>'	+ 
                                '<h4>Notes Details!</h4>' +
                                '<h3>' + note.title + '</h3>' + 
                                '<h4>What went well today?!</h4>' +
                                '<p>' + note.dailyReflection[0] + '</p>' +
                                "<h4>What didn't go as planned?!</h4>" +
                                '<p>' + note.dailyReflection[1] + '</p>' +
                                '<h4>What can be improved upon?!</h4>' +
                                '<p>' + note.dailyReflection[2] + '</p>' +
                                "<h4>What's on your mind?!</h4>" +
                                '<p>' + note.dailyReflection[3] + '</p>' +
                                '<br>'	+ 
                                '<br>'	+ 
                                '<p>Keep using QuickNotes!' 
                    };
                }else if(note.type === 'meal-planner'){
                    msgToReciever = {
                        to: 	 'anushkarvp1999@gmail.com',
                        from: 	 'v.anushka786@gmail.com',
                        subject: 'Notes from QuickNotes!',
                        html: 	'Hi, ' + shareUser.receiverName + '!' +
                                '<br>'	+ 
                                note.author.username + ' just shared their notes with you!' + 
                                '<br>'	+ 
                                '<h4>Notes Details!</h4>' + 
                                '<h3>' + note.title + '</h3>' + 
                                '<table id="tblData">' +          
                                    '<thead>' +
                                        '<tr>' +
                                            '<th></th>' +
                                            '<th>Breakfast</th>' +
                                            '<th>Lunch</th>' + 
                                            '<th>Dinner</th>' +
                                       ' </tr>' +
                                    '</thead>' +
                                    '<tbody>' +
                                        '<tr>' +
                                            '<td class="day"><strong>Sunday</strong></td>' +
                                            '<td>' + note.meal1[0] + '</td>' +
                                            '<td>' + note.meal2[0] + '</td>' +
                                            '<td>' + note.meal3[0] + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td class="day"><strong>Monday</strong></td>' +
                                            '<td>' + note.meal1[1] + '</td>' +
                                            '<td>' + note.meal2[1] + '</td>' +
                                            '<td>' + note.meal3[1] + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td class="day"><strong>Tuesday</strong></td>' +
                                            '<td>' + note.meal1[2] + '</td>' +
                                            '<td>' + note.meal2[2] + '</td>' +
                                            '<td>' + note.meal3[2] + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td class="day"><strong>Wednesday</strong></td>' +
                                            '<td>' + note.meal1[3] + '</td>' +
                                            '<td>' + note.meal2[3] + '</td>' +
                                            '<td>' + note.meal3[3] + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td class="day"><strong>Thursday</strong></td>' +
                                            '<td>' + note.meal1[4] + '</td>' +
                                            '<td>' + note.meal2[4] + '</td>' +
                                            '<td>' + note.meal3[4] + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td class="day"><strong>Friday</strong></td>' +
                                            '<td>' + note.meal1[5] + '</td>' +
                                            '<td>' + note.meal2[5] + '</td>' +
                                            '<td>' + note.meal3[5] + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td class="day"><strong>Saturday</strong></td>' +
                                            '<td>' + note.meal1[6] + '</td>' +
                                            '<td>' + note.meal2[6] + '</td>' +
                                            '<td>' + note.meal3[6] + '</td>' +
                                        '</tr>' +
                                    '</tbody>' +
                                '</table>' +
                                '<br>'	+ 
                                '<br>'	+ 
                                '<p>Join QuickNotes today to enjoy making notes for free!'
                    };
                    msgToUser = {
                        to: 	 'v.anushka786@gmail.com',
                        from: 	 'QuickNotes@gmail.com',
                        subject: 'Notes shared with ' + shareUser.receiverName,
                        html: 	'Hi, ' + note.author.username +
                                '<br>'	+ 
                                'Your notes have been shared with ' + shareUser.receiverName + 
                                '<br>'	+ 
                                '<h4>Notes Details!</h4>' +
                                '<h3>' + note.title + '</h3>' + 
                                '<table id="tblData">' +          
                                    '<thead>' +
                                        '<tr>' +
                                            '<th></th>' +
                                            '<th>Breakfast</th>' +
                                            '<th>Lunch</th>' + 
                                            '<th>Dinner</th>' +
                                       ' </tr>' +
                                    '</thead>' +
                                    '<tbody>' +
                                        '<tr>' +
                                            '<td class="day"><strong>Sunday</strong></td>' +
                                            '<td>' + note.meal1[0] + '</td>' +
                                            '<td>' + note.meal2[0] + '</td>' +
                                            '<td>' + note.meal3[0] + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td class="day"><strong>Monday</strong></td>' +
                                            '<td>' + note.meal1[1] + '</td>' +
                                            '<td>' + note.meal2[1] + '</td>' +
                                            '<td>' + note.meal3[1] + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td class="day"><strong>Tuesday</strong></td>' +
                                            '<td>' + note.meal1[2] + '</td>' +
                                            '<td>' + note.meal2[2] + '</td>' +
                                            '<td>' + note.meal3[2] + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td class="day"><strong>Wednesday</strong></td>' +
                                            '<td>' + note.meal1[3] + '</td>' +
                                            '<td>' + note.meal2[3] + '</td>' +
                                            '<td>' + note.meal3[3] + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td class="day"><strong>Thursday</strong></td>' +
                                            '<td>' + note.meal1[4] + '</td>' +
                                            '<td>' + note.meal2[4] + '</td>' +
                                            '<td>' + note.meal3[4] + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td class="day"><strong>Friday</strong></td>' +
                                            '<td>' + note.meal1[5] + '</td>' +
                                            '<td>' + note.meal2[5] + '</td>' +
                                            '<td>' + note.meal3[5] + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td class="day"><strong>Saturday</strong></td>' +
                                            '<td>' + note.meal1[6] + '</td>' +
                                            '<td>' + note.meal2[6] + '</td>' +
                                            '<td>' + note.meal3[6] + '</td>' +
                                        '</tr>' +
                                    '</tbody>' +
                                '</table>' +
                                '<br>'	+ 
                                '<br>'	+ 
                                '<p>Keep using QuickNotes!' 
                    };
                }
                sgMail.send(msgToReciever, (error, result) =>{
                    if (error) {
                        req.flash("error", "Email not sent!" );                
                        console.log(error);
                    }
                    else {
                        sgMail.send(msgToUser, (error, result) =>{
                            if (error) {
                                req.flash("error", "Email not sent!" );                
                                console.log(error);
                            }
                            else {
                                req.flash("success", "Email Sent!" );    
                                return res.redirect('/' + req.params.id + '/notes');
                            };	
                        });
                    }
                });
            }
        });
     }
});
// app.get("/:id/notes", middleware.isAuthenticated, async function(req, res){

//     User.findById(req.params.id, function(error, user){
//         if(error){
//             req.flash("error", "Something went wrong! User not found!" );
//             console.log(error);
//         }else{
//             Note.find({}, function(error, allNotes){
//                 if(error){
//                     req.flash("error", "Something went wrong! Notes not found!" );
//                     console.log(error);
//                 }else{
//                     res.render("homepage", {user: user, notes:allNotes});            
//                 }
//             });
//         }
//     });
    
// });
    
// ADD NEW NOTE
app.post("/:id/notes", middleware.isAuthenticated, function(req,res){
    // res.send("POST Req");
    // console.log("post");
    User.findById(req.params.id, function(error, user){
        if(error){
            
            req.flash("error", "Something went wrong!" );
            console.log(error);
            return res.redirect("back");
        }else{           
            Note.create(req.body.note, function(error, note){
                if(error){
                    console.log(error);
                }else{

                    // console.log("Note create else 1");
                    note.author.id = req.user._id;
                    note.author.username = req.user.username;
                    note.save();

                    user.notes.push(note);
                    // console.log("note");
                    // console.log(note);
                    user.save();

                    req.flash("success", "Successfully added note!" );
                    res.redirect("/" + req.params.id + "/notes" );
                }
            });
        }
    });
});

app.get("/:id/notes/new", middleware.isAuthenticated, function(req, res){

    User.findById(req.params.id, function(error, user){
        if(error){
            console.log(error);
            req.flash("error", "Something went wrong! User not found!" );
        }else{
            Note.find({}, function(error, note){
                if(error){
                    req.flash("error", "Something went wrong! Notes not found!" );
                    console.log(error);
                }else{
                    res.render("new", {user: user, note: note});
                }
            });
        }
    });
});

// EDIT
//  middleware.checkNoteOwnership,
app.get("/:id/notes/:note_id/edit", middleware.isAuthenticated, function(req, res){

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
app.put("/:id/notes/:note_id", middleware.isAuthenticated, function(req, res){

    // req.body.blog.body = req.sanitize(req.body.blog.body);
    Note.findByIdAndUpdate(req.params.note_id, req.body.note, function(error, updatedNote){
        if(error){
            res.redirect("back");
        }else{
            req.flash("success", "Successfully updated note!" );
            res.redirect("/" + req.params.id + "/notes/" );
        }
    });    
});

// DESTROY
// middleware.checkNoteOwnership,
app.delete("/:id/notes/:note_id", middleware.isAuthenticated, function(req, res){

    User.findById(req.params.id, function(error, user){
        if(error){
            console.log(error);
            req.flash("error", "Something went wrong! User not found!" );
            return res.redirect("back");
        }else{
            Note.findByIdAndRemove(req.params.note_id, function(error){
                if(error){
                    req.flash("error", "Something went wrong! Notes not found!" );
                    console.log(error);
                    res.redirect("back");
                }else{
                    req.flash("success", "Note deleted!" );
                    res.redirect("/" + req.params.id + "/notes/" );
                }
            });
        }
    });
    
    // Note.findByIdAndRemove(req.params.note_id, function(error){
    //     if(error){
    //         res.redirect("back");
    //     }else{
    //         req.flash("success", "Note deleted!" );
    //         res.redirect("/" + req.params.id + "/notes/" );
    //     }
    // });
});

// USER PROFILE
app.get("/:id/profile", middleware.isAuthenticated, function(req, res){

    User.findById(req.params.id, function(error, foundUser){
        if(error){
            req.flash("error", "Something went wrong!" );
            console.log(error);
        }else{
            res.render("profile", {user: foundUser});            
        }
    });
});

// ADD NEW NOTE
// app.post("/:id/profile/edit", function(req,res){
//     User.findByIdAndUpdate(req.params.id, req.body.user, function(error, updatedProfile){
//         if(error){
//             req.flash("error", "Something went wrong!" );
//             res.redirect("back");
//         }else{
//             req.flash("success", "Successfully updated note!" );
//             res.redirect(req.params.id + "/profile/" );
//         }
//     });   
    
// });
app.post("/:id/profile/profileImg", middleware.isAuthenticated, upload.single('image'), function(req,res){
    // res.send("POST Req");
    User.findById(req.params.id, async function(error, user){
        if(error){
            req.flash("error", "Something went wrong!" );
            console.log(error);
        }else{
            if(req.file){
                try{
                    var result = await cloudinary.v2.uploader.upload(req.file.path);
                    user.imageId = result.public_id;
                    user.image = result.secure_url;
                }catch(err){
                    req.flash("error", "Something went wrong!" );
                    console.log(err);
                    return res.redirect("back");
                }
            }
        }
        // user.save();
        // console.log("req.body.user");
        // console.log(req.body);
        // console.log(req.body.user.firstName);
        // console.log(req.body.user.lastName);
        if(req.body.user.firstName.length > 0)
            user.firstName = req.body.user.firstName;
        if(req.body.user.lastName.length > 0)
            user.lastName = req.body.user.lastName;
        // if(req.body.user.gender.length > 0)
            user.gender = req.body.user.gender;
        console.log("req.body.user");
        console.log(req.body);
        console.log(req.body.user.gender);

        console.log("user.gender");
        console.log(user.gender);

        if(req.body.user.contact.length > 0)
            user.contact = req.body.user.contact;
        if(req.body.user.bio.length > 0)
            user.bio = req.body.user.bio;
        user.save();
        req.flash("success", "Successfully Updated!" );
        
        console.log("user");
        console.log(user);
        res.redirect('/' + req.params.id + "/profile");
    });
});

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function(){
    console.log('Server listening on port', app.get('port'));
});  