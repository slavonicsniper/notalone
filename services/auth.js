const createError = require('http-errors')
const LocalStrategy = require('passport-local');
const FacebookStrategy = require('passport-facebook');
const {User, FederatedUser} = require('../models');
const { Op } = require('@sequelize/core');

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
      message: 'Not authorized'
    })
  }
}

const login = async (data) => {
  try {
    const {email, password} = data
    const user = await User.findOne({
      where: {
        [Op.or]: [{email}, {username: email}]
      }
    })

    if(!user) {
      throw createError(401, 'Incorrect username/email or password')
    } else {
      if(await user.validPassword(password)) {
        return user
      } else {
        throw createError(401, 'Incorrect username/email or password')
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
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.BACKEND_URL + '/users/login/facebook/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const federatedUser = await FederatedUser.findOne({where: {
        provider: profile.provider,
        subject: profile.id
      }})
      if(federatedUser) {
        const user = await User.findOne({where: {
          id: federatedUser.user_id
        }})
        return done(null, user);  
      } else {
        const username = profile.displayName.toLowerCase().split(' ').join('') + Math.floor(Math.random() * 100)
        const user = await User.create({username, email: '', password: '', city: '', country: '', age: ''})
        await FederatedUser.create({provider: profile.provider, subject: profile.id, user_id: user.id})
        return done(null, user);
      }
    } catch(err) {
      return done(err)
    }
  }));
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