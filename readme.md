Note about installing and running MongoDB
Section 27, Lecture 252
Hi Everyone!

A new step has been added to get MongoDB installed and running on c9, before you run the 3 commands from the following video lecture, you'll first need to run sudo apt-get install -y mongodb-org from your terminal in c9.

Further instructions can be found here.

Meanwhile, after you're up and running with mongo, be sure to shut down your mongod server each time you're done working. You can do this with ctrl + c 

If you leave it running then Cloud 9 could timeout and cause mongo to crash. If this happens, try the following steps to repair it. 

From the command line, run:

cd ~
./mongod --repair
If you're still having trouble getting it to run then find the /data directory (it should be inside of ~ or ~/workspace) and cd into it. Once inside, run rm mongod.lock then cd back into ~ and run ./mongod again (see below).

cd ~/data
rm mongod.lock
cd
./mongod
If you continue to have difficulties with this then please open up a new discussion so we can assist you.


Thanks,
Ian
Course TA


Hi Everyone,

In the next few lectures you will learn about an Object Document Modeling (ODM) package for Express called Mongoose.

You may run into a warning in your terminal regarding the deprecation of mpromise, it will look like this:

Mongoose: mpromise (mongoose's default promise library) is deprecated, plug in your own promise library
instead: http://mongoosejs.com/docs/promises.html
We don't use promises in this course, so that warning can be safely ignored.

If you want the warning to go away then you can plug the following line of code into your app, after you've required mongoose: mongoose.Promise = global.Promise; 

That line of code simply replaces Mongoose's default promise library with JavaScript's native promise library.

Update: Another warning that you may experience when using mongoose is this:

`open()` is deprecated in mongoose >= 4.11.0, use `openUri()` instead, 
or set the `useMongoClient` option if using `connect()` or `createConnection()`
To make this go away simply use:

mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
instead of the regular mongoose.connect() syntax.

cheers,
Ian