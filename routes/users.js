var express = require('express');
var router = express.Router();
const {User} = require('../models')
const passport = require('passport');
const { checkAuthUser, checkAuthentication } = require('../services/auth');
const jwt = require("jsonwebtoken")
const {sendConfirmationEmail} = require('../services/sendmail')
require("dotenv").config();

router.post('/register', async (req, res, next) => {
  try {
    const token = await jwt.sign({email: req.body.email}, process.env.JWT_ACC_ACTIVATE, { expiresIn: '1d' })
    req.body.confirmation_code = token
    const {username} = req.body
    const [user, created] = await User.findOrCreate({
      where: { username },
      defaults: req.body
    })
    if(created) {
      await sendConfirmationEmail(user.username, user.email, user.confirmation_code)
      res.status(201).send({
        status: 'Success',
        message: 'User registered, please confirm your email',
        data: user
      })
    }
    else {
      res.status(400).send({
        status: 'Failed',
        message: 'User already exists'
      })
    }
  } catch(err) {
    next(err)
  }
});

router.get('/confirm/:confirmationCode', async (req, res) => {
  try {
    const decodedToken = await jwt.verify(req.params.confirmationCode, process.env.JWT_ACC_ACTIVATE)
    if(!decodedToken) {
      res.status(404).send({
        status: 'Failed',
        message: 'Wrong or expired token'
      })      
    } else {
      const {email} = decodedToken
      const user = await User.findOne({
        where: {
          email
        }
      })
      if(!user) {
        res.status(404).send({
          status: 'Failed',
          message: 'User not found'
        })      
      } else {
        await user.update({
          status: 'Active'
        })
        res.status(200).send({
          status: 'Success',
          message: 'Email confirmed'
        })
      }
    }
  } catch(err) {
    next(err)
  }
})

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.status(200).send({
    status: 'Success',
    message: 'Authenticated',
  })
})

router.get('/', checkAuthentication, async (req, res, next) => {
  try {
    const users = await User.findAll()
    if(!users) {
      res.status(404).send({
        status: 'Failed',
        message: 'No users found'
      })
    } else {
      res.status(200).send({
        status: 'Success',
        message: 'Users found',
        data: users
      })
    }
  } catch(err) {
    next(err)
  }
})

router.get('/:uuid', checkAuthentication, checkAuthUser, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        uuid: req.user.uuid
      }
    })
    if(!user) {
      res.status(404).send({
        status: 'Failed',
        message: 'User not found'
      })
    } else {
      res.status(200).send({
        status: 'Success',
        message: 'User found',
        data: user
      })
    }
  } catch(err) {
    next(err)
  }
})

router.put('/:uuid', checkAuthentication, checkAuthUser, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        uuid: req.user.uuid
      }
    })
    if(!user) {
      res.status(404).send({
        status: 'Failed',
        message: 'User not found'
      })
    } else {
      const updateUser = await user.update(req.body)
      res.status(200).send({
        status: 'Success',
        message: 'User profile updated',
        data: updateUser
      })
    }
  } catch(err) {
    next(err)
  }
})

router.delete('/:uuid', checkAuthentication, checkAuthUser, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        uuid: req.user.uuid
      }
    })
    if(!user) {
      res.status(404).send({
        status: 'Failed',
        message: 'User not found'
      })
    } else {
      await user.destroy()
      req.logout()
      res.status(200).send({
        status: 'Success',
        message: 'User deleted',
      })
    }
  } catch(err) {
    next(err)
  }
})

module.exports = router;
