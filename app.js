const express = require('express');
const createError = require('http-errors');
const path = require('path');

const cors = require('cors')
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const { initPassport } = require('./services/auth')

const SequelizeStore = require("connect-session-sequelize")(session.Store);
const { sequelize } = require('./models')
const myStore = new SequelizeStore({
  db: sequelize,
  tableName: 'sessions'
});

const logger = require('morgan'); // for logging, can be removed in production

// Import routes
const usersRouter = require('./routes/users');
const availabilitiesRouter = require('./routes/availabilities');
const activitiesRouter = require('./routes/activities');
const messagesRouter = require('./routes/messages');

// Express middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './client/build')));

// activate CORS
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))

// Session middleware
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

// Logging middleware
app.use(logger('dev'));

// Routes
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/availabilities', availabilitiesRouter);
app.use('/api/v1/activities', activitiesRouter);
app.use('/api/v1/messages', messagesRouter);

// Handles any requests that don't match the routes above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: "Failed",
    message: err.message
  });
});

module.exports = app;
