var express = require('express');
var router = express.Router();
const {User, Activity, Availability, UserActivity, UserVerification} = require('../models')
const passport = require('passport');
const { checkAuthentication } = require('../services/auth');
const jwt = require("jsonwebtoken")
const {sendConfirmationEmail, sendResetPasswordEmail} = require('../services/sendmail');
const useractivity = require('../models/useractivity');
require("dotenv").config();
const { Op } = require('@sequelize/core')

router.post('/register', async (req, res, next) => {
  try {
    const {username, email, password, city, country, age} = req.body
    const user = await User.findOne({
      where: {email}
    })
    if(!user) {
      const token = jwt.sign({username, email, password, city, country, age}, process.env.JWT_ACC_ACTIVATE, { expiresIn: 60 })
      if(token) {
        await UserVerification.create({email_confirmation: token})
        await sendConfirmationEmail(username, email, token)
        res.status(201).send({
          status: 'Success',
          message: 'Please confirm your email to finish the registration.',
        })
      }
    } else {
      res.status(400).send({
        status: 'Failed',
        message: 'Email already used'
      })
    }
  } catch(err) {
    next(err)
  }
});

router.get('/confirm/:confirmationCode', async (req, res, next) => {
  try {
    const verifiedToken = jwt.verify(req.params.confirmationCode, process.env.JWT_ACC_ACTIVATE)
    const {username, email, password, city, country, age} = verifiedToken
    const [user, created] = await User.findOrCreate({
      where: { email: verifiedToken.email },
      defaults: {username, email, password, city, country, age}
    })
    if(created) {
      res.status(201).send({
        status: 'Success',
        message: 'Email confirmed',
      })
    }
    else {
      res.status(400).send({
        status: 'Failed',
        message: 'User already exists'
      })
    }
  } catch(err) {
    if(err.name === "TokenExpiredError") {
      const recievedToken = await UserVerification.findOne({
        where: {
          email_confirmation: req.params.confirmationCode
        }
      })
      if(recievedToken) {
        const decodedToken = jwt.decode(recievedToken.email_confirmation)
        console.log(decodedToken)
        if(decodedToken) {
          const {username, email, password, city, country, age} = decodedToken
          const newToken = jwt.sign({username, email, password, city, country, age}, process.env.JWT_ACC_ACTIVATE, { expiresIn: 60 })
          if(newToken) {
            await recievedToken.update({email_confirmation: newToken})
            await sendConfirmationEmail(username, email, newToken)
          }
          res.status(401).send({
            status: 'Failed',
            message: 'Your token expired, a new confirmation email has been sent to you, please confirm it again'
          })      
        }
      } else {
        res.status(401).send({
          status: 'Failed',
          message: 'Unknown token, you have to register again.'
        })
      } 
    } else {
      next(err)
    }
  }
})

router.post('/reset-password', async (req, res, next) => {
  const {email} = req.body
  try {
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
      const token = jwt.sign({email}, process.env.JWT_RESET_PASSWORD, { expiresIn: 60 })
      await UserVerification.create({password_reset: token})
      await sendResetPasswordEmail(user.username, user.email, token)
      res.status(200).send({
        status: 'Success',
        message: 'Password reset link sent',
      })      
    }
  } catch(err) {
    next(err)
  }

})

router.put('/reset-password/:confirmationCode', async (req, res, next) => {
  try {
    const verifiedToken = jwt.verify(req.params.confirmationCode, process.env.JWT_RESET_PASSWORD)
    const {email} = verifiedToken
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
      await user.update(req.body)
      res.status(200).send({
        status: 'Success',
        message: 'Password reset'
      })
    }
  } catch(err) {
    if(err.name === "TokenExpiredError") {
      const recievedToken = await UserVerification.findOne({
        where: {
          password_reset: req.params.confirmationCode
        }
      })
      if(recievedToken) {
        const decodedToken = jwt.decode(recievedToken.password_reset)
        if(decodedToken) {
          console.log(decodedToken)
          const {email} = decodedToken
          const user = await User.findOne({
            where: {
              email
            }
          })
          if(user) {
            const newToken = jwt.sign({email}, process.env.JWT_RESET_PASSWORD, { expiresIn: '1d' })
            if(newToken) {
              await recievedToken.update({password_reset: newToken})
              await sendResetPasswordEmail(user.username, user.email, newToken)
            }
            res.status(401).send({
              status: 'Failed',
              message: 'Your token expired, a new reset password email has been sent to you.'
            })
          } else {
            res.status(404).send({
              status: 'Failed',
              message: 'User not found'
            })      
          }    
        }
      } else {
        res.status(401).send({
          status: 'Failed',
          message: 'Unknown token, you have to reset the password again.'
        })
      }
    } else {
      next(err)
    }
  }  
})

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.status(200).send({
    status: 'Success',
    message: 'Authenticated',
    data: {
      username: req.user.username,
      uuid: req.user.uuid
    }
  })
})

router.get('/logout', checkAuthentication, (req, res, next) => {
  try {
    req.logout()
    res.status(200).send({
      status: 'Success',
      message: 'User logged out',
    })
  } catch(err) {
    next(err)
  }
})



router.get('/', checkAuthentication, async (req, res, next) => {
  /* we will need something like this for more queries with filters
  const makeSequelizeOptions = (query) => {
    const options = {}
    query.joinModel ? options.include = {model: req.query.joinModel} : null
    query.joinModelLimit ? options.include.limit = req.query.joinModelLimit : null
    query.model ? options.include.include = {model: req.query.model} : null
    return options
  }
  */
  try {
    if(req.query.filter) {
      const user = await User.findOne({
        where: {
          uuid: req.user.uuid
        },
      })
      const userActivities = await user.getActivities({
        joinTableAttributes: [],
        attributes: ['uuid']
      })
      const userAvailabilities = await user.getAvailabilities({
        attributes: ['day', 'start_time', 'end_time']
      })      
      const whereForAvailabilities = userAvailabilities.map(availability => {
        return {
          day: availability.day,
          start_time: {
            [Op.gte]: availability.start_time
          },
          end_time: {
            [Op.lte]: availability.end_time
          }
        }
      })
      const whereForActivities = userActivities.map(activity => activity.uuid)

      const users = await User.findAll({
        include: [{
          model: UserActivity,
          limit: 3,
          attributes: ['activity_id'],
          include: {
            model: Activity,
            attributes: ['name'],
            where: {
              uuid: whereForActivities
            },
          }
        },{
          model: Availability,
          limit: 3,
          attributes: ['day', 'start_time', 'end_time'],
          where: {
            [Op.or]: whereForAvailabilities
          }
        }],
        where: {
          uuid: {
            [Op.ne]: req.user.uuid
          }
        },
      })
      const filteredUsers = users.filter(user => user.UserActivities.length > 0 && user.Availabilities.length > 0)
      if(filteredUsers) {
        res.status(200).send({
          status: 'Success',
          message: 'Users found',
          data: filteredUsers
        })
      } else {
        res.status(404).send({
          status: 'Failed',
          message: 'No users found'
        })
      }
    } else {
      const users = await User.findAll({
        include: [{
          model: Activity,
          through: {
            attributes: []
          }
        },{
          model: Availability,
        }]
      })
      if(users) {
        res.status(200).send({
          status: 'Success',
          message: 'Users found',
          data: users
        })
      } else {
        res.status(404).send({
          status: 'Failed',
          message: 'No users found'
        })
      }
    }

  } catch(err) {
    next(err)
  }
})

router.get('/profile', checkAuthentication, async (req, res, next) => {
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

router.get('/:uuid', checkAuthentication, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        uuid: req.params.uuid
      },
      include: [{
        model: Availability,
      },{
        model: Activity,
        through: {
          attributes: []
        }
      }]
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

router.put('/profile', checkAuthentication, async (req, res, next) => {
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

router.delete('/profile', checkAuthentication, async (req, res, next) => {
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
