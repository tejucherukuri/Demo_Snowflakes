var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var snowflake = require('snowflake-sdk');

// Create a Connection object that we can use later to connect.
var connection = snowflake.createConnection( {
  account: 'kh27117',
  username: 'intraedge',
  password: '********',
  region: 'us-east-1',
  database: 'STUDENT_PROFILE'
  }
  );

  // Try to connect to Snowflake, and check whether the connection was successful.
connection.connect( 
  function(err, conn) {
      if (err) {
          console.error('Unable to connect: ' + err.message);
          } 
      else {
          console.log('Successfully connected to Snowflake.');
          // Optional: store the connection ID.
          connection_ID = conn.getId();
          }
      }
  );
 
  connection.execute({
    sqlText: 'select * from USER',
    complete: function(err, stmt, rows) {
      if (err) {
        console.error('Failed to execute statement due to the following error: ' + err.message);
      } else {
        console.log('Number of rows in the User table ' + rows.length); // c1: 1.123456789123456789123456789
      }
    }
  })




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
