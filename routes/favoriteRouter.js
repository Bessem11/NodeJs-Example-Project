const authenticate = require('../authenticate');
const express=require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');
const Favorites = require('../models/favorites');
const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.get(cors.cors,authenticate.verifyUser,(req,res,next) => {
    Favorites.find({user:req.user._id})
    .populate('user')
    .populate('dishe')
    .then((results)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(results);
    },(err) => next(err))
    .catch((err) => next(err))
})
.post(cors.cors,authenticate.verifyUser,(req,res,next) =>{
    var dishesArray=[]
    for(var i=0; i< req.body.length;i++)
         dishesArray.push(req.body[i]._id);

    Favorites.find({'user':req.user._id})
    .then((favorite)=>{
       if(!favorite){
             for(var i=0; i< req.body.length;i++)
                 favorite.dishe.push(req.body[i]._id);
            favorite.save()
            .then((favorite)=>{res.statusCode = 200;
             res.setHeader('Content-Type', 'application/json');
             res.json(favorite);
        }, (err) => next(err))
        .catch((err) => next(err));
       }
       else{
            Favorites.create({'user':req.user._id,'dishe':dishesArray})
            .then ((favorite)=>{ 
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
             }, (err) => next(err))
            .catch((err) => next(err))
        }
    },(err) => next(err))
    .catch((err) => next(err))
})
.delete(cors.cors,authenticate.verifyUser,(req,res,next) => {
    Favorites.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err))
});

favoriteRouter.route('/:favoriteId')
.post(cors.cors,authenticate.verifyUser,(req,res,next) => {
    Favorites.find({'user':req.user._id})
    .then((favorite)=>{
        console.log(favorite);
       if (!favorite) {
            favorite.dishe.push(req.params.favoriteId);
            favorite.save()
            .then((favorite)=>{res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        }, (err) => next(err))
        .catch((err) => next(err))
       }
       else{
            Favorites.create({'user':req.user._id,'dishe':[req.params.favoriteId]})
            .then ((favorite)=>{ 
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
             }, (err) => next(err))
            .catch((err) => next(err))
        }
    },(err) => next(err))
    .catch((err) => next(err))
})
.delete(cors.cors,authenticate.verifyUser,(req,res,next) => {
    Favorites.find({'user':req.user._id})
    .then((favorite) => {
        const index = favorite.indexOf(req.params.favoriteId);
        if (index > -1) {
            favorite.splice(index, 1);
            favorite.save()
            .then((favorite)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            },(err)=>next(err))
            .catch((err) => next(err))
        }
        else{
            err = new Error('This Favorie Dish does not exist in your preference list');
            err.status = 404;
            return next(err);
        }
        
    }, (err) => next(err))
    .catch((err) => next(err))
});



module.exports = favoriteRouter;