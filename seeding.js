var mongoose = require('mongoose');
var yelpC = require("./models/campgrounds");
var Comment = require("./models/comments")

var data = [{
        name:"seeding", image:"https://farm5.staticflickr.com/4110/5213931833_8fd62a1dce.jpg", descriptions:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name:"seeding 2", image:"https://farm5.staticflickr.com/4110/5213931833_8fd62a1dce.jpg", descriptions:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
    }
]

function seedDB(){
    yelpC.remove({}, function(err){
        if(err){
            console.log(err);
        } else{
            console.log("removed");
            data.forEach(function(seed){
              yelpC.create(seed, function(err, data){
                if(err){
                    console.log(err);
                } else{
                    console.log("added");
                        Comment.create({
                            text: "this is the text", author: "mark will"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                data.comments.push(comment);
                                data.save();
                                console.log("comment created");
                            }
                        });
                }
            });  
            });

        }
     });
    
};


module.exports = seedDB;