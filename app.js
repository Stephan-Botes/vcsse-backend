const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const cors = require("cors");
// const helmet = require('helmet');
const indexRouter = require('./routes/index');

// Express app setup
const app = express();

/* Middleware setup:
morgan/ logger is a node.js package that logs all requests, errors and result in the server console
cors is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object.
express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays.
Helmet helps you secure your Express apps by setting various HTTP headers. It has 15 default middlewares
 */
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(helmet());

// Custom helmet options - Setup for preferring https over http & allow cross origin policies
// app.use(helmet.hsts({maxAge: 123456,}));
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Route setup
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
