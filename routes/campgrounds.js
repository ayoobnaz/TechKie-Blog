var express = require("express");
var router = express.Router();
var middleware = require("../middleware");


var yelpC = require("../models/campgrounds");
var Comment = require("../models/comments");


router.get("/campgrounds" , function(req, res){
    yelpC.find({} , function(err , allcamp){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds" , {campgrounds : allcamp});
        }
    });
        
    
});

router.post("/campgrounds" , middleware.IsLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var descriptions = req.body.descriptions;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name , image:image , descriptions: descriptions, author: author, price:price }
    yelpC.create(newCampground , function(err, newCamp){
        if(err){
            console.log(err);
        }else{

                res.redirect("/campgrounds");
        }
    });
});

router.get("/campgrounds/new" , middleware.IsLoggedIn, function(req, res) {
    res.render("new.ejs");
});

router.get("/campgrounds/:id" , function(req, res){
    yelpC.findById(req.params.id).populate("comments").exec(function(err , desCamp){
      if(err){
          console.log(err);
      } else{
              res.render("show", {campground: desCamp});
      } 
    });
});

router.get("/campgrounds/:id/edit", middleware.chkAuth, function(req, res){
    yelpC.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});


router.put("/campgrounds/:id", middleware.chkAuth, function(req, res){
    // find and update the correct campground
    yelpC.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});


router.delete("/campgrounds/:id", middleware.chkAuth, function(req, res){
   yelpC.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
      }
   });
});



module.exports = router;