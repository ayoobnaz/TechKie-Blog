var express = require("express");
var router = express.Router();

var mainDbs = require("../models/articles");
var Comment = require("../models/comments");
var middleware = require("../middleware");


router.get("/articles/:id/comments/new" ,middleware.IsLoggedIn, function(req, res) {
    mainDbs.findById(req.params.id , function(err, foundCom){
        if(err){
            console.log(err);
        } else {
            res.render("comNew" , {article: foundCom});
        }
    });
});

router.post("/articles/:id/comments" , middleware.IsLoggedIn, function(req, res){
    mainDbs.findById(req.params.id , function(err, article) {
        if(err){
            console.log("err");
            res.redirect("/articles");
        } else {
            Comment.create(req.body.comment , function(err, comment){
              if(err){
                  req.flash("error" , "Something went wrong");
                  console.log(err);
              }  else {
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.save();
               article.comments.push(comment);
               article.save();
               req.flash("success" , "Successfully added coment");
               res.redirect('/articles/' + article._id);
              }
            });
        }
    });
});


router.get("/articles/:id/comments/:comment_id/edit", middleware.chkComAuth, function(req, res){
      Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("articles/editCom", {article_id: req.params.id, comment: foundComment});
      }
  });
});

router.put("/articles/:id/comments/:comment_id", middleware.chkComAuth, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/articles/" + req.params.id );
      }
   });
});

router.delete("/articles/:id/comments/:comment_id", middleware.chkComAuth, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success" , "Your Comment Removed");
           res.redirect("/articles/" + req.params.id);
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