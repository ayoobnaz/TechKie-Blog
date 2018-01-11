var express = require("express");
var router = express.Router();

var yelpC = require("../models/campgrounds");
var seedDB = require("../seeding");
var Comment = require("../models/comments");
var middleware = require("../middleware");


router.get("/campgrounds/:id/comments/new" ,middleware.IsLoggedIn, function(req, res) {
    yelpC.findById(req.params.id , function(err, foundCom){
        if(err){
            console.log(err);
        } else {
            res.render("comNew" , {campground: foundCom});
        }
    });
});

router.post("/campgrounds/:id/comments" , middleware.IsLoggedIn, function(req, res){
    yelpC.findById(req.params.id , function(err, campground) {
        if(err){
            console.log("err");
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment , function(err, comment){
              if(err){
                  req.flash("error" , "Something went wrong");
                  console.log(err);
              }  else {
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.save();
               campground.comments.push(comment);
               campground.save();
               req.flash("success" , "Successfully added coment");
               res.redirect('/campgrounds/' + campground._id);
              }
            });
        }
    });
});


router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.chkComAuth, function(req, res){
      Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("campgrounds/editCom", {campground_id: req.params.id, comment: foundComment});
      }
  });
});

router.put("/campgrounds/:id/comments/:comment_id", middleware.chkComAuth, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/campgrounds/" + req.params.id );
      }
   });
});

router.delete("/campgrounds/:id/comments/:comment_id", middleware.chkComAuth, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success" , "Your Comment Removed");
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});




function IsLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else{
        res.redirect("/login");
    }
}

module.exports = router;