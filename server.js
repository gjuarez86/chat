var express = require('express');
var User = require('./model/user');
var app = express();
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/chatusersdb");

app.use(express.static('public'));

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

app.get('/user', function(req, res){
  User.find(function(err, user) {
    res.send(user);
  });
});

app.post('/create/user', function(req, res){
  var user = new User(req.body);
  user.save(function(err, users) {
    res.redirect('/');
    });
});

app.post('/login', function(req, res){ //you want to use get when your not chaging something..here we are changing state from logged out to login so its a post
  User.findOne({username: req.body.username, password: req.body.password}, function(err, user) {
    res.cookie('user', user);//cookies are data stored in the browser. we want store the logged in user in the cookies.
    res.redirect('/');
  });//to get user data for later.
});// '/' will always go to index by default if we have static files turned on.

app.listen(3000, function(){
  console.log('Ready on Port 3000');
});

