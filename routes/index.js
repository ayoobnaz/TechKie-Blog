var express = require("express");
var router = express.Router();
var passport = require("passport");

var User = require("../models/user");


router.get("/" , function(req , res){
    res.render("yelp");
});

router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register" , function(req, res){
    var nUser = new User({username: req.body.username});
    req.body.username
    req.body.password
    User.register(nUser, req.body.password , function(err, reg){
        if (err) {
            req.flash("error" , err.message);
            return res.render("register");
        } else {
            passport.authenticate('local') (req, res, function() {
            req.flash("success" , "Hello " + reg.username );
            res.redirect('/campgrounds');
  });
        }
    });
});

router.get("/login" , function(req, res) {
    res.render("login");
});

router.post("/login" , passport.authenticate('local' ,{
  successRedirect: '/campgrounds',
  failureRedirect: '/login'
}), function(req, res) {
});

router.get("/logout" , function(req, res) {
    req.logout();
    req.flash("success", "logged you out");
    res.redirect("/campgrounds");
});


function IsLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else{
        res.redirect("/login");
    }
}

module.exports = router;