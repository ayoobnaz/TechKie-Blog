var mainDbs = require("../models/articles");
var Comment = require("../models/comments");

var middlewareObj = {};

middlewareObj.chkAuth = function(req, res, next){
 if(req.isAuthenticated()){
        mainDbs.findById(req.params.id, function(err, foundCampground){
           if(err){
               req.flash("error" , "Campground not found");
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
                req.flash("error" , "Permission denied");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.chkComAuth = function(req, res, next){
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
                req.flash("error" , "You dont have Permission");
            }
           }
        });
    } else {
        res.redirect("back");
        req.flash("error" , "Please LogIn");
    }
}


middlewareObj.IsLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else{
        req.flash("error" , "Please LogIn");
        res.redirect("/login");
    }
}

module.exports = middlewareObj;