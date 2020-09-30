const dishRouter=require('./routes/dishRouter');
const leaderRouter=require('./routes/leaderRouter');
const promoRouter=require('./routes/promoRouter');
const usersRouter=require('./routes/usersRouter');
const favoriteRouter=require('./routes/favoriteRouter');

var passport = require('passport');


const http = require('http');
const express=require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
var config = require('./config');



const url =config.mongoUrl;
const connect = mongoose.connect(url);



const hostname = 'localhost';
const port = 3000;
const app=express()

connect.then((db) => {
  console.log("Connected correctly to server");
}, (err) => { console.log(err); });
app.use(morgan('dev'));

app.use(passport.initialize());
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/leaders',leaderRouter);
app.use('/promotions',promoRouter)
app.use('/favorites',favoriteRouter);

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
