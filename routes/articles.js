var express = require("express");
var router = express.Router();
var middleware = require("../middleware");


var mainDbs = require("../models/articles");
var Comment = require("../models/comments");


router.get("/articles" , function(req, res){
    mainDbs.find({} , function(err , allArt){
        if(err){
            console.log(err);
        }else{
            res.render("articles" , {articles : allArt});
        }
    });
        
    
});

router.post("/articles" , middleware.IsLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var descriptions = req.body.descriptions;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newArticles = {name: name , image:image , descriptions: descriptions, author: author, price:price }
    mainDbs.create(newArticles , function(err, newArt){
        if(err){
            console.log(err);
        }else{

                res.redirect("/articles");
        }
    });
});

router.get("/articles/new" , middleware.IsLoggedIn, function(req, res) {
    res.render("new.ejs");
});

router.get("/articles/:id" , function(req, res){
    mainDbs.findById(req.params.id).populate("comments").exec(function(err , desArt){
      if(err){
          console.log(err);
      } else{
              res.render("show", {article: desArt});
      } 
    });
});

router.get("/articles/:id/edit", middleware.chkAuth, function(req, res){
    mainDbs.findById(req.params.id, function(err, foundArticles){
        res.render("articles/edit", {article: foundArticles});
    });
});


router.put("/articles/:id", middleware.chkAuth, function(req, res){
    // find and update the correct campground
    mainDbs.findByIdAndUpdate(req.params.id, req.body.article, function(err, updatedArticles){
       if(err){
           res.redirect("/articles");
       } else {
           //redirect somewhere(show page)
           res.redirect("/articles/" + req.params.id);
       }
    });
});


router.delete("/articles/:id", middleware.chkAuth, function(req, res){
   mainDbs.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/articles");
      } else {
          res.redirect("/articles");
      }
   });
});



module.exports = router;