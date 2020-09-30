const express=require('express');
const bodyParser=require('body-parser');
const Promotion = require ('../models/promotions');
const authenticate = require('../authenticate');
const cors = require('./cors');

const promoRouter=express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.options(cors.corsWithOptions,(req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
   Promotion.find({})
   .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
   }, (err) => { 
       next(err);
   })
   .catch((err)=> next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
   Promotion.create(req.body)
   .then( (promotion) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(promotion);
   },(err)=>{next(err);})
   .catch ((err)=>next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Promotion.remove({})
    .then( (resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err)
    )    .catch((err) => next(err));    
});

promoRouter.route('/:promotionId')
.options(cors.corsWithOptions,(req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
    Promotion.findById(req.params.promotionId)
    .then ( (promotion) => {
        if (promotion != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion);
        }
        else {
            err = new Error('Promotion ' + req.params.PromotionId + ' not found');
            err.status = 404;
            return next(err);
        }
    },(err) => next(err))
    .catch ((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/'+ req.params.promotionId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Promotion.findByIdAndUpdate(req.params.promotionId,{
        $set:req.body
    },{ new: true })
    .then ((promotion) => {
        if (promotion != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion);
        }
        else {
            err = new Error('Promotion ' + req.params.PromotionId + ' not found');
            err.status = 404;
            return next(err);
        }
    },(err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Promotion.findByIdAndRemove(req.params.promotionId)
    .then((resp)=>{
        if (resp != null) {
             res.statusCode = 200;
             res.setHeader('Content-Type', 'application/json');
             res.json(resp);
        }
        else{
            err = new Error('Promotion ' + req.params.PromotionId + ' not found');
            err.status = 404;
            return next(err);
        }
    },(err)=>next(err))
    .catch ((err)=>next(err));
});

module.exports = promoRouter;