var express                = require("express"),
    bodyParser             = require("body-parser");
    // mongoose               = require("mongoose"),
    // flash                  = require("connect-flash"),
    // methodOverride         = require("method-override"),
    // passport               = require("passport"),
    // LocalStrategy          = require("passport-local"),
    // passportLocalMongoose  = require("passport-local-mongoose"),

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");
// mongoose.connect("mongodb://localhost:27017/YelpCamp", { useNewUrlParser: true });

// app.use(methodOverride("_method"));
// app.use(flash());

app.get("/", function(req, res){
    res.render("landing.ejs");
    // res.send("Landing Page");
});


app.listen(3000, function(){
    console.log("Server started");
});