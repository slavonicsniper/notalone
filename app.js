var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const {initPassport} = require('./services/auth')
const cors = require('cors')
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const {sequelize} = require('./models')
const myStore = new SequelizeStore({
  db: sequelize,
  tableName: 'sessions'
});

var usersRouter = require('./routes/users');
var availabilitiesRouter = require('./routes/availabilities');
var activitiesRouter = require('./routes/activities');
var messagesRouter = require('./routes/messages');

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './client/build')));
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: myStore,
}))
myStore.sync()
app.use(cookieParser(process.env.SECRET));
app.use(passport.initialize()) 
app.use(passport.session())    
initPassport(passport)

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/availabilities', availabilitiesRouter);
app.use('/api/v1/activities', activitiesRouter);
app.use('/api/v1/messages', messagesRouter);

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  
// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.send({
      status: "Failed",
      message: err.message
  });
});

module.exports = app;
