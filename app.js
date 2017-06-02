const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors')

const index = require('./routes/index');
const auth = require('./routes/api/v1/auth');
const user = require('./routes/api/v1/user');
const administrator = require('./routes/api/v1/administrator');

const app = express();

// connect to database
require('./models').connect(process.env.GREEN_YOGA_DB);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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




app.use('/', index);
app.use('/api/v1/auth', auth);

// ensure user is authenticated
const authCheck = require('./middleware/auth-check');
app.use('/api/v1/', authCheck);
// middleware to prevent access to administrator area
const administratorCheck = require('./middleware/administrator-check');
app.use('/api/v1/admin', adminCheck);
// middleware to prevent access to teacher area
const teacherCheck = require('./middleware/teacher-check');
app.use('/api/v1/teacher', teacherCheck);
// middleware to prevent access to receptionist area
const receptionistCheck = require('./middleware/receptionist-check');
app.use('/api/v1/receptionist', receptionistCheck);

// routes which require passing through middleware
app.use('/api/v1/user', user);
app.use('/api/v1/administrator', administrator);

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
