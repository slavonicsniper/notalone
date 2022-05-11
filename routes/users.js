const { User, Activity, Availability, UserVerification } = require('../models')
const express = require('express');
const router = express.Router();
require("dotenv").config();

const passport = require('passport');
const jwt = require("jsonwebtoken")
const { checkAuthentication } = require('../services/auth');
const { sendConfirmationEmail, sendResetPasswordEmail } = require('../services/sendmail');

const { Op } = require('@sequelize/core');


// Checks if a given username and email are already in use
router.get('/available', async (req, res, next) => {

  try {
    const usernameOrEmailExists = await User.findOne({
      where: {
        [req.query.column]: req.query.value
      }
    });

    if (usernameOrEmailExists) {
      return res.status(200).send({
        status: "Failed"
      });
    }

    res.status(200).send({
      status: "Success"
    });

  } catch (err) {
    console.log(err);
  }
});

// Adds a new user to the database, then sends a confirmation email to the user (does not save new user data yet)
router.post('/register', async (req, res, next) => {

  const { username, email, password, city, country, region, age } = req.body;

  try {
    // check if email already exists in database
    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).send({
        status: 'Failed',
        message: 'Email already used'
      });
    }

    // generate new token for user confirmation
    const token = jwt.sign({
      username,
      email,
      password,
      city,
      country,
      region,
      age
    }, process.env.JWT_ACC_ACTIVATE, { expiresIn: "1d" });

    if (!token) {
      return res.status(500).send({
        status: 'Failed',
        message: 'Error signing token'
      });
    }

    await UserVerification.create({ email_confirmation: token })
    await sendConfirmationEmail(username, email, token)
    res.status(201).send({
      status: 'Success',
      message: 'Please confirm your email to finish the registration before you login.',
    });

  } catch (err) {
    console.log(err);
  }
});

// Authenticates the user via passport
router.post('/login', passport.authenticate('local'), (req, res) => {

  res.status(200).send({
    status: 'Success',
    message: 'Authenticated',
    data: {
      username: req.user.username,
      uuid: req.user.uuid
    }
  });
});

// Processes the user confirmation token for registering user
router.get('/confirm/:confirmationCode', async (req, res, next) => {

  try {
    // checks if the token is valid and hasn't expired yet
    const verifiedToken = jwt.verify(req.params.confirmationCode, process.env.JWT_ACC_ACTIVATE);
    const { username, email, password, city, country, region, age } = verifiedToken;

    // saves the confirmed user's data to the database, returns error if user already exists somehow
    const [user, created] = await User.findOrCreate({
      where: { email: verifiedToken.email },
      defaults: { username, email, password, city, country, region, age }
    });
    if (!created) {
      return res.status(400).send({
        status: 'Failed',
        message: 'User already exists'
      });
    }

    // removes the user verification token from the database, then returns successful response
    UserVerification.destroy({ where: { email_confirmation: req.params.confirmationCode } });
    res.status(201).send({
      status: 'Success',
      message: 'Email confirmed',
    });

  } catch (err) {

    // TODO refactor this somehow into guard clauses
    if (err.name === "TokenExpiredError") {
      const recievedToken = await UserVerification.findOne({
        where: {
          email_confirmation: req.params.confirmationCode
        }
      })
      if (recievedToken) {
        const decodedToken = jwt.decode(recievedToken.email_confirmation)
        if (decodedToken) {
          const { username, email, password, city, country, region, age } = decodedToken
          const newToken = jwt.sign({ username, email, password, city, country, region, age }, process.env.JWT_ACC_ACTIVATE, { expiresIn: "1d" })
          if (newToken) {
            await recievedToken.update({ email_confirmation: newToken })
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
      console.log(err);
    }
  }
})

// Sends a confirmation email to the user for password reset
router.post('/reset-password', async (req, res, next) => {

  const { email } = req.body

  try {
    // checks if user exists, returns error otherwise
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send({
        status: 'Failed',
        message: 'User not found'
      });
    }

    // generate new token for user confirmation, then sends email to user
    const token = jwt.sign({ email }, process.env.JWT_RESET_PASSWORD, { expiresIn: "1d" });
    await UserVerification.create({ password_reset: token });
    await sendResetPasswordEmail(user.username, user.email, token);

    res.status(200).send({
      status: 'Success',
      message: 'Password reset link sent',
    });

  } catch (err) {
    console.log(err);
  }
});

// Processes the user confirmation token for resetting password
router.put('/reset-password/:confirmationCode', async (req, res, next) => {

  try {
    // check if token exists in database
    const receivedToken = await UserVerification.findOne({
      where: {
        password_reset: req.params.confirmationCode
      }
    });
    if (!receivedToken) {
      return res.status(401).send({
        status: 'Failed',
        message: 'Unknown token, you have to reset the password again.'
      });
    }

    // verify token then check if user exists
    const verifiedToken = jwt.verify(req.params.confirmationCode, process.env.JWT_RESET_PASSWORD);
    const { email } = verifiedToken;
    const { password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send({
        status: 'Failed',
        message: 'User not found'
      });
    }

    // update the user's password and delete the token from the database
    await user.update({ password });
    UserVerification.destroy({ where: { password_reset: req.params.confirmationCode } });

    res.status(200).send({
      status: 'Success',
      message: 'Password reset'
    });

  } catch (err) {

    // TODO refactor this somehow into guard clauses
    if (err.name === "TokenExpiredError") {
      const decodedToken = jwt.decode(recievedToken.password_reset)
      if (decodedToken) {
        const { email } = decodedToken
        const user = await User.findOne({
          where: {
            email
          }
        })
        if (user) {
          const newToken = jwt.sign({ email }, process.env.JWT_RESET_PASSWORD, { expiresIn: '1d' })
          if (newToken) {
            await recievedToken.update({ password_reset: newToken })
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

router.get('/login/success', checkAuthentication, (req, res, next) => {
  res.status(200).send({
    status: 'Success',
    message: 'Authenticated',
    data: {
      username: req.user.username,
      uuid: req.user.uuid
    }
  })
})

router.get('/login/facebook', passport.authenticate('facebook'))

router.get('/login/facebook/callback', passport.authenticate('facebook', {
  successRedirect: process.env.CLIENT_URL,
  failureRedirect: process.env.CLIENT_URL + '/login',
}))

// Logs out the user
router.get('/logout', checkAuthentication, (req, res, next) => {

  try {
    req.logout();

    res.status(200).send({
      status: 'Success',
      message: 'User logged out',
    });
  } catch (err) {
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
      attributes: ['username', 'uuid', 'country', 'region', 'city', 'age', 'description']
    }

    const user = await User.findOne({
      where: {
        uuid: req.user.uuid
      },
    })

    if (req.query.country) {
      options.where.country = user.country
    }

    if (req.query.city) {
      options.where.city = user.city
    }

    let whereForActivities
    if (req.query.onlyMatch || req.query.activity) {
      const userActivities = await user.getActivities({
        joinTableAttributes: [],
        attributes: ['uuid']
      })
      whereForActivities = userActivities.map(activity => activity.uuid)
    }

    options.include.push({
      model: Activity,
      attributes: ['name', 'uuid'],
      where: (req.query.activity || req.query.onlyMatch) && { uuid: whereForActivities },
      through: {
        attributes: []
      }
    })

    let whereForAvailabilities
    if (req.query.onlyMatch || req.query.availability) {
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
      where: (req.query.availability || req.query.onlyMatch) && { [Op.or]: whereForAvailabilities }
    })

    const users = await User.findAll(options)
    let filteredUsers
    if (req.query.onlyMatch || (req.query.activity && req.query.availability) || (req.query.activity && req.query.availability && req.query.onlyMatch)) {
      filteredUsers = users.filter(user => user.Activities.length > 0 && user.Availabilities.length > 0)
    } else if (req.query.activity) {
      filteredUsers = users.filter(user => user.Activities.length > 0)
    } else if (req.query.availability) {
      filteredUsers = users.filter(user => user.Availabilities.length > 0)
    } else {
      filteredUsers = users
    }

    res.status(200).send({
      data: filteredUsers
    })
  } catch (err) {
    console.log(err)
  }
})



// Returns the user's profile
router.get('/profile', checkAuthentication, async (req, res, next) => {

  try {
    const user = await User.findOne({
      where: {
        uuid: req.user.uuid
      }
    });
    if (!user) {
      return res.status(404).send({
        status: 'Failed',
        message: 'User not found'
      });
    }

    res.status(200).send({
      status: 'Success',
      message: 'User found',
      data: user
    });

  } catch (err) {
    console.log(err);
  }
});

// Update the user's profile
router.put('/profile', checkAuthentication, async (req, res, next) => {

  try {
    const user = await User.findOne({ where: { uuid: req.user.uuid } });
    if (!user) {
      return res.status(404).send({
        status: 'Failed',
        message: 'User not found'
      });
    }

    const updateUser = await user.update(req.body);
    res.status(200).send({
      status: 'Success',
      message: 'User profile updated',
    });

  } catch (err) {
    console.log(err);
  }
});

// Delete the user's profile
router.delete('/profile', checkAuthentication, async (req, res, next) => {

  try {
    const user = await User.findOne({ where: { uuid: req.user.uuid } });
    if (!user) {
      return res.status(404).send({
        status: 'Failed',
        message: 'User not found'
      });
    }

    await user.destroy();
    req.logout();

    res.status(200).send({
      status: 'Success',
      message: 'User deleted',
    });

  } catch (err) {
    console.log(err)
  }
});

// Gets the user and their activities
router.get('/me', checkAuthentication, async (req, res, next) => {

  try {
    const user = await User.findOne({
      where: {
        uuid: req.user.uuid
      },
      include: [{
        model: Availability,
      }, {
        model: Activity,
        through: {
          attributes: []
        }
      }]
    });

    if (!user) {
      return res.status(404).send({
        status: 'Failed',
        message: 'User not found'
      });
    }

    res.status(200).send({
      status: 'Success',
      message: 'User found',
      data: user
    });

  } catch (err) {
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
      }, {
        model: Activity,
        through: {
          attributes: []
        }
      }]
    })
    if (!user) {
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
  } catch (err) {
    console.log(err)
  }
})

module.exports = router;
