var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var dotenv = require('dotenv');

var apiRouter = require('./routes/api');
var apiProducts = require('./routes/product');
var apiUsers = require('./routes/user');
var apiCategories = require('./routes/category');
var apiBills = require('./routes/bill');

var app = express();

const options = {
  origin: 'http://localhost:4200',
  credentials: true
}
app.use(cors(options));
dotenv.config();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/api', apiRouter);
app.use('/api/products', apiProducts)
app.use('/api/users', apiUsers)
app.use('/api/categories', apiCategories)
app.use('/api/bill', apiBills)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
