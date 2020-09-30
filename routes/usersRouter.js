var authenticate = require('../authenticate');
var passport = require('passport');
var User=require('../models/user')
const bodyParser=require('body-parser');
const express=require('express');
const { model } = require('mongoose');

const usersRouter=express.Router();

usersRouter.use(bodyParser.json());

usersRouter.get('/',authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
  User.find({})
  .then((users)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  },(err) => { 
    next(err);
}).catch((err)=> next(err))
});


usersRouter.post('/signup', (req, res, next) => {
    User.register(new User({username: req.body.username}), 
      req.body.password, (err, user) => {
      if(err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      }
      else {
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      }
    });
  });

  usersRouter.post('/login', passport.authenticate('local'), (req, res) => {

    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
  });


  module.exports = usersRouter;