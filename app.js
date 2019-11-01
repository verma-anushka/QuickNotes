require("dotenv").config()

// PACKAGES
var express                = require("express"),
    bodyParser             = require("body-parser"),
    mongoose               = require("mongoose"),
    async                  = require("async"),
    nodemailer             = require("nodemailer"),
    flash                  = require("connect-flash"),
    methodOverride         = require("method-override"),
    passport               = require("passport"),
    LocalStrategy          = require("passport-local"),
    passportLocalMongoose  = require("passport-local-mongoose"),
    middleware             = require("./middleware");

var app = express();

// DATABASE
var db = require('./database.js');

// MODELS
var User = require("./models/user");
var Note = require("./models/notes");


// ROUTES
var noteRoutes = require("./routes/note"),
    userRoutes = require("./routes/user"),
    indexRoutes = require("./routes/index")

// GENERAL SETTINGS
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


// PASSPORT CONFIGURATION
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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next){
    res.locals.user = req.user || null;
    res.locals.note = req.note || null;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


// ROUTES
app.use("/", indexRoutes);
app.use("/", userRoutes);
app.use("/", noteRoutes);


// PORT SETTINGS
var url=process.env.DATABASEURL || "mongodb://localhost:27017/notes";
mongoose.connect(url, { useCreateIndex: true,
                        useNewUrlParser: true,
                        useUnifiedTopology: true })
        .then(() => console.log(`Database connected`))
        .catch(err => console.log(`Database connection error: ${err.message}`));

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function(){
    console.log('Server listening on port', app.get('port'));
}); 
