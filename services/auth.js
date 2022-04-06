const createError = require('http-errors')
const LocalStrategy = require('passport-local');
const {User} = require('../models')

const checkAuthentication = (req, res, next) => {
  if(req.isAuthenticated()) {
      return next()
  } else {
      res.status(401).send({
        status: 'Failed',
        message: 'Not authenticated'
      })
  }
}

const checkAuthUser = (req, res, next) => {
  if(req.params.uuid === req.user.uuid) {
      return next()
  } else {
    res.status(401).send({
      status: 'Failed',
      message: 'Not authenticated'
    })
  }
}

const login = async (data) => {
  try {
    const {email, password} = data
    const user = await User.findOne({
      where: {
        email
      }
    })

    if(!user) {
      throw createError(401, 'Incorrect email or password')
    } else {
      if (user.confirmation_status != "Active") {
        throw createError(401, "Pending Account. Please Verify Your Email!")
      }
      if(await user.validPassword(password)) {
        return user
      } else {
        throw createError(401, 'Incorrect email or password')
      }
    }
  } catch(err) {
    throw createError(500, err)
  }
}

const initPassport = passport => {
  passport.use(new LocalStrategy({
    usernameField: 'email'
  }, async (email, password, done) => {
    try {
      const user = await login({email, password})
      return done(null, user)
    } catch(err) {
      return done(err)
    }
  }))  
  passport.serializeUser(function(user, done) {
      return done(null, {username: user.username, uuid: user.uuid});
  });  
  passport.deserializeUser(function(user, done) {
      return done(null, user);
  });
  return passport
}

module.exports = {
  initPassport,
  checkAuthentication,
  checkAuthUser
}