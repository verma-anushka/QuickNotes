var express                = require("express"),
    router                 = express.Router();
    passport               = require("passport"),
    db                     = require('../database'),
    User                   = require("../models/user"),
    Note                   = require("../models/notes");

// HOMEPAGE 
router.get("/", function(req, res){   
    res.render("homepage");
});

// AUTHENTICATION
router.post("/", async function(req, res, next){

    // SIGN UP
    if (req.body.form == 'signUp'){
        
        let errors = [];
        var { username, email, password, password2 } = req.body;

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
            for(var i=0; i< errors.length; i++){
                req.flash('error', errors[i] );     
            }
            res.render('homepage', {errors, username, email, password, password2});
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
                User.register(user, req.body.password, function(err,user){
                    if(err){
                        console.log(err);
                        req.flash("error", "Something went wrong!");            
                        res.render("homepage");
                    }
                    passport.authenticate("local")(req, res, function(){
                        req.flash("success", "Welcome to QuickNotes, " + user.username + "!");
                        return res.redirect('/' + user._id + '/notes');
                    });
                });
            }
        }
    }else{
        next();
    }
}, function(req, res, next){

    // LOGIN
    if(req.body.form == 'login'){

        passport.authenticate('local', function( err, user, info) {
            if (err) { 
                console.log(err);
                req.flash("error",  "Something went wrong!");            
                return res.render("homepage");
            }
            if (!user) { 
                req.flash("error", "Invalid Username or Password!");            
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
                    console.log(err);
                    req.flash("error", "Something went wrong!");            
                    return res.render("homepage");
                }
                req.flash("success", "Successfully Logged in!"); 
                return res.redirect('/' + user._id + '/notes');
            });
        })(req, res) 
    }else{
        next();
    }
}, function(req, res, next){

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
                             'This link will remain valid for an hour.' +
                             'If you did not request this, please ignore this email; your password will remain unchanged.\n'
                };
                smtpTransport.sendMail(mailOptions, function (err) {
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
        next();
    }

},function(req, res, next){

    // LOGOUT
    if(req.body.form == 'logout'){
        req.logout();
        req.flash("success", "Successfully Logged out!");
        return res.redirect("/");
    }
}

);

// RESET PASSWORD 
router.get('/reset/:token', function (req, res) {

    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
            req.flash('error', 'Password reset token invalid or expired. Please try again!');
            return res.redirect('/');
        }
        res.render('reset', { token: req.params.token });
    });
});

router.post('/reset/:token', function (req, res) {

    async.waterfall([
        function (done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                if (!user) {
                    req.flash('error', 'Password reset token invalid or expired. Please try again!');
                    return res.redirect('back');
                }
                if(req.body.password.length < 4){
                    req.flash("error", "Password length should be atleast 4 characters.");
                    return res.redirect('back');
                } else if (req.body.password !== req.body.confirm) {
                    req.flash("error", "Passwords do not match.");
                    return res.redirect('back');
                } else {
                    user.setPassword(req.body.password, function (err) {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;
                        user.save(function (err) {
                            req.logIn(user, function (err) {
                                done(err, user);
                            });
                        });
                    })
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
                text:    'Confirmation Mail!\n\n' +
                         'This is a confirmation that the password for your account ' + user.email + ' has been changed.\n'
            };

            smtpTransport.sendMail(mailOptions, function (err) {
                req.flash('success', 'Password successfully changed!');
                done(err);
            });
        }
    ], function (err) {
        res.redirect('/');
        // res.redirect('/' + user._id + '/notes');
    });
});

module.exports = router;