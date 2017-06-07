const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors')

// connect to database
require('./models').connect(process.env.GREEN_YOGA_DB);

// import routes
const index = require('./routes/index');

// import API routes
const indexapi = require('./routes/api/v1/index');
const attendances = require('./routes/api/v1/attendances');
const auth = require('./routes/api/v1/auth');
const lessons = require('./routes/api/v1/lessons');
const locations = require('./routes/api/v1/locations');
const user = require('./routes/api/v1/user');
const types = require('./routes/api/v1/types');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set up CORS
app.use(cors())

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// pass the passport middleware
app.use(passport.initialize());

// load passport strategies
const localSignupStrategy = require('./passport/local-signup');
const localLoginStrategy = require('./passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);


// set up routes
app.use('/', index);
app.use('/api/v1/', indexapi);
app.use('/api/v1/attendances', attendances);
app.use('/api/v1/auth', auth);
app.use('/api/v1/lessons', lessons);
app.use('/api/v1/locations', locations);
app.use('/api/v1/user', user);
app.use('/api/v1/types', types);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
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
