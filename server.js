var express = require('express');
var User = require('./model/user');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');//now I can read the cookies before just setting them.
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/chatusersdb");

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cookieParser());

app.get('/', function(req, res){
  var user = req.cookies.user;//var user is the same user in cookies.user //this wil evaluate to what you set cookie so if just sert it will have somethingb but if logout undefine
  if(user) {
    res.send("Hello World," + user.username);
  } else {
    res.send("Hello World, Please Login");
  }
});
//var user = req.cookies('user');
// var username = user.username;

//cookieParser will turn into object normally its a string. It's going to look exactly the same as the user.js
app.get('/user', function(req, res){
  User.find(function(err, user) {
    res.send(user);
  });
});

app.post('/create/user', function(req, res){
  var user = new User(req.body);
  user.save(function(err, user) {
    res.cookie('user', user);
    res.redirect('/');
    });
});

app.post('/login', function(req, res){ //you want to use get when your not chaging something..here we are changing state from logged out to login so its a post
  User.findOne({username: req.body.username, password: req.body.password}, function(err, user) {
    res.cookie('user', user);//cookies are data stored in the browser. we want store the logged in user in the cookies.
    res.redirect('/');//this is setting the cookie with the user key 'user'
  });//to get user data for later.
});// '/' will always go to index by default if we have static files turned on.
//We want the site to remember if someone is logged in with cookies. We deposit a cookie into the browser by using res.cookie. res.cookie is built into express

app.post('/logout', function(req, res){
  res.clearCookie('user');//here it deletes the 'user' cookie
  res.redirect('/');
});


app.listen(3000, function(){
  console.log('Ready on Port 3000');
});


//2pm tomorrow
//1.Get bcrypt
//ecrypt user password when create user and match encrypted password in login
//you need to change the create and the login.
//you want to delete the users in there now since not set up to encrypt users
//I dont want password in the cookie.
