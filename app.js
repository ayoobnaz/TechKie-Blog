var express = require("express");
var app = express();
var parser = require("body-parser");
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require("passport");
var LocalStrategy = require("passport-local");
var localMongoose = require("passport-local-mongoose");
var methodOverride = require("method-override");
var User = require("./models/user");
var yelpC = require("./models/campgrounds");
var seedDB = require("./seeding");
var Comment = require("./models/comments");
var flash = require('connect-flash');

var commentRT = require("./routes/comments");
var campgroundsRT = require("./routes/campgrounds");
var indexRT = require("./routes/index");


// seedDB();

mongoose.connect('mongodb://localhost/dtBs', { useMongoClient: true });
mongoose.Promise = global.Promise;

app.use(flash());
app.use(parser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine" , "ejs");

    
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'thahani is the best',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
    res.locals.currUser = req.user;
    res.locals.error =  req.flash("error");
    res.locals.success =  req.flash("success");

    next();
});

app.use(commentRT);
app.use(indexRT);
app.use(campgroundsRT);


app.listen(process.env.PORT , process.env.IP , function(){
    console.log("server has stated");
});