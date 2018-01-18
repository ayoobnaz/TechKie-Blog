var express = require("express");
var router = express.Router();
var middleware = require("../middleware");
var dotenv = require('dotenv')


var mainDbs = require("../models/articles");
var Comment = require("../models/comments");
var request = require("request");
var multer = require('multer');


var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: process.env.DB_HOST ,
  api_key: process.env.DB_USER ,
  api_secret: process.env.DB_PASS
});



router.get("/articles" , function(req, res){
    mainDbs.find({} , function(err , allArt){
        if(err){
            console.log(err);
        }else{
            res.render("articles" , {articles : allArt});
        }
    });
        
    
});



router.post("/articles" , middleware.IsLoggedIn, upload.single('image'), function(req, res){

  cloudinary.uploader.upload(req.file.path, function(result) {
  // add cloudinary url for the image to the campground object under image property
  req.body.article.image = result.secure_url;
  // add author to campground
  req.body.article.author = {
    id: req.user._id,
    username: req.user.username
  }
  mainDbs.create(req.body.article, function(err, article) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    res.redirect('/articles/' + article.id);
  });
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