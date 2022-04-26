var express = require('express');
var router = express.Router();
const {User, Activity, Availability, UserActivity, UserVerification} = require('../models')
const passport = require('passport');
const { checkAuthentication } = require('../services/auth');
const jwt = require("jsonwebtoken")
const {sendConfirmationEmail, sendResetPasswordEmail} = require('../services/sendmail');
const useractivity = require('../models/useractivity');
require("dotenv").config();
const { Op } = require('@sequelize/core');

router.post('/register', async (req, res, next) => {
  try {
    const {username, email, password, city, country, region, age} = req.body
    const user = await User.findOne({
      where: {email}
    })
    if(!user) {
      const token = jwt.sign({username, email, password, city, country, region, age}, process.env.JWT_ACC_ACTIVATE, { expiresIn: "1d" })
      if(token) {
        await UserVerification.create({email_confirmation: token})
        await sendConfirmationEmail(username, email, token)
        res.status(201).send({
          status: 'Success',
          message: 'Please confirm your email to finish the registration before you login.',
        })
      }
    } else {
      res.status(400).send({
        status: 'Failed',
        message: 'Email already used'
      })
    }
  } catch(err) {
    console.log(err)
  }
});

router.get('/confirm/:confirmationCode', async (req, res, next) => {
  try {
    const verifiedToken = jwt.verify(req.params.confirmationCode, process.env.JWT_ACC_ACTIVATE)
    const {username, email, password, city, country, region, age} = verifiedToken
    const [user, created] = await User.findOrCreate({
      where: { email: verifiedToken.email },
      defaults: {username, email, password, city, country, region, age}
    })
    if(created) {
      UserVerification.destroy({where: {email_confirmation: req.params.confirmationCode}})
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
        if(decodedToken) {
          const {username, email, password, city, country, region, age} = decodedToken
          const newToken = jwt.sign({username, email, password, city, country, region, age}, process.env.JWT_ACC_ACTIVATE, { expiresIn: "1d" })
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
      console.log(err)
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
      const token = jwt.sign({email}, process.env.JWT_RESET_PASSWORD, { expiresIn: "1d" })
      await UserVerification.create({password_reset: token})
      await sendResetPasswordEmail(user.username, user.email, token)
      res.status(200).send({
        status: 'Success',
        message: 'Password reset link sent',
      })      
    }
  } catch(err) {
    console.log(err)
  }

})

router.put('/reset-password/:confirmationCode', async (req, res, next) => {
  try {
    const recievedToken = await UserVerification.findOne({
      where: {
        password_reset: req.params.confirmationCode
      }
    })
    if(recievedToken) {
      const verifiedToken = jwt.verify(req.params.confirmationCode, process.env.JWT_RESET_PASSWORD)
      const {email} = verifiedToken
      const {password} = req.body
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
        await user.update({password})
        UserVerification.destroy({where: {password_reset: req.params.confirmationCode}})
        res.status(200).send({
          status: 'Success',
          message: 'Password reset'
        })
      }
    } else {
      res.status(401).send({
        status: 'Failed',
        message: 'Unknown token, you have to reset the password again.'
      })
    }
    
  } catch(err) {
    if(err.name === "TokenExpiredError") {
      const decodedToken = jwt.decode(recievedToken.password_reset)
      if(decodedToken) {
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
      console.log(err)
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
    console.log(err)
  }
})

router.get('/', checkAuthentication, async (req, res, next) => {
  req.query.onlyMatch && console.log('onlyMatch is true')
  try {
    const options = {
      include: [],
      where: {
        uuid: {
          [Op.ne]: req.user.uuid
        }
      },
      attributes: ['username', 'uuid', 'country', 'region', 'city', 'age']
    }

    const user = await User.findOne({
      where: {
        uuid: req.user.uuid
      },
    })
    
    if(req.query.country) {
      options.where.country = user.country
    }

    if(req.query.city) {
      options.where.city = user.city
    }
    
    let whereForActivities
    if(req.query.onlyMatch || req.query.activity) {
      const userActivities = await user.getActivities({
        joinTableAttributes: [],
        attributes: ['uuid']
      })
      whereForActivities = userActivities.map(activity => activity.uuid)
    }
    
    options.include.push({
      model: Activity,
      attributes: ['name', 'uuid'],
      where: (req.query.activity || req.query.onlyMatch) && {uuid: whereForActivities},
      through: {
        attributes: []
      }
    })

    let whereForAvailabilities
    if(req.query.onlyMatch || req.query.availability) {
      const userAvailabilities = await user.getAvailabilities({
        attributes: ['day', 'start_time', 'end_time']
      })      
      whereForAvailabilities = userAvailabilities.map(availability => {
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
    }

    options.include.push({
      model: Availability,
      attributes: ['day', 'start_time', 'end_time', 'uuid'],
      where: (req.query.availability || req.query.onlyMatch) && {[Op.or]: whereForAvailabilities}
    })
    
    const users = await User.findAll(options)
    let filteredUsers
    if(req.query.onlyMatch || (req.query.activity && req.query.availability) || (req.query.activity && req.query.availability && req.query.onlyMatch)) {
      filteredUsers = users.filter(user => user.Activities.length > 0 && user.Availabilities.length > 0)
    } else if(req.query.activity) {
      filteredUsers = users.filter(user => user.Activities.length > 0)
    } else if(req.query.availability) {
      filteredUsers = users.filter(user => user.Availabilities.length > 0)
    } else {
      filteredUsers = users
    }
    
    res.status(200).send({
      data: filteredUsers
    })
  } catch(err) {
    console.log(err)
  }
})

router.get('/available', async (req, res, next) => {
  try {
    const usernameOrEmail = await User.findOne({
        where: {
          [req.query.column]: req.query.value
        }
      })    
    if(!usernameOrEmail) {
      res.status(200).send({
        status: "Success",
      })
    } else {
      res.status(200).send({
        status: "Failed"
      })
    }
  } catch(err) {
    console.log(err)
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
    console.log(err)
  }
})

router.get('/me', checkAuthentication, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        uuid: req.user.uuid
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
    console.log(err)
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
    console.log(err)
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
      })
    }
  } catch(err) {
    console.log(err)
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
    console.log(err)
  }
})

module.exports = router;
