var express = require('express'),
    app = express(),

    mongoose = require('mongoose'),
    authfb = require('./src/controllers/auth.js'),
    passport = require('passport'),
    session = require('express-session'),
<<<<<<< HEAD

    bodyParser = require('body-parser'),
    passport = require('passport'),

    errorHandler = require('./src/errors/errorHandler.js'),
    errorLogger = require('./src/errors/errorLogger.js'),

    homeController = require('./src/controllers/home.js'),
    servicesController = require('./src/controllers/services.js'),
    serviceController = require('./src/controllers/service.js'),

    cookieParser = require('cookie-parser');
=======
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    errorHandler = require('./src/errors/errorHandler.js'),
    errorLogger = require('./src/errors/errorLogger.js'),
    redisStore = require('connect-redis');
>>>>>>> add dish to session.dishes

//TODO: Избавиться от хардкода(сделать конфиг) 
mongoose.connect('mongodb://localhost/lenka');

app.use(cookieParser());
app.use(session({
    secret: 'appsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: new Date(Date.now() + 3600000)
    }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.set('view engine', 'jade');
app.set('views', './src/pages');
app.get('/', homeController);
app.get('/services', servicesController);
app.get('/services/:id', serviceController);

app.post('/mymenu', function(req, res) {
    if(req.body.action == 'menu'){
        if(!req.session.orders){
            req.session.orders = [];
        }
        req.session.orders.push(req.body.orderNameCustomer);
        req.session.orders.push(req.body.orderTime);
        req.session.orders.push(req.body.orderServiceId);
        console.log(req.session.orders);
        res.redirect('/services/' + req.body.orderServiceId);

    }
});
app.get('/mymenu', function(req, res){
    res.render('menuPage', {customerName: ownerName, time: orderTime, orderId: orderId});
});

app.use(errorLogger);
app.use(errorHandler);
app.use(express.static(__dirname + '/dist'));

app.get('/auth/fb',passport.authenticate('facebook', {successRedirect: 'back', failureRedirect: '/'}));
app.get('/auth/vk',passport.authenticate('vk', {successRedirect: 'back', failureRedirect: '/'}));

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

app.post('/orders', function(req, res) {
    if (req.body.action == 'add'){ 
        if(!req.session.dishes){
            req.session.dishes = [];
        }
        console.log(req.session.dishes)
        req.session.dishes.push(req.body.dishId);
        res.redirect('back');
    }
});
app.get('/orders', function (req, res) {
    res.render('menuPage', {number:itemsInCart, cart: req.session.dishes});
});
//already last(error processing)
app.use(function(req, res) {
  res.render('404.jade');
});
app.listen(3000, function() {
    console.log('Working 3000');
});
