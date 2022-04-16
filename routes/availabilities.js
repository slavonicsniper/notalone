var express = require('express');
var router = express.Router();
const {Availability, User, sequelize} = require('../models')
const { checkAuthentication } = require('../services/auth');

router.get('/', checkAuthentication, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        uuid: req.user.uuid
      }
    })
    const availabilities = await user.getAvailabilities()
    if(availabilities.length > 0) {
      res.status(200).send({
        status: 'Success',
        message: 'Availabilities found',
        data: availabilities
      })
    } else {
      res.status(404).send({
        status: 'Failed',
        message: 'No availabilities found'
      })
    }
  } catch(err) {
    next(err)
  }
})

router.post('/', checkAuthentication, async (req, res, next) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const user = await User.findOne({
        where: {
          uuid: req.user.uuid
        }
      })
      const availabilities = await Availability.bulkCreate(req.body, {
        transaction: t
      })
      await user.addAvailabilities(availabilities, {
        transaction: t
      })
      return availabilities
    });
    res.status(201).send({
      status: 'Success',
      message: 'Availabilities created',
      data: result
    })
  } catch(err) {
    next(err)
  }
})

router.get('/:uuid', checkAuthentication,  async (req, res, next) => {
  try {
    const availability = await Availability.findOne({
      where: {
        uuid: req.params.uuid
      }
    })
    if(availability) {
      res.status(200).send({
        status: 'Success',
        message: 'Availability found',
        data: availability
      })
    } else {
      res.status(404).send({
        status: 'Failed',
        message: 'Availability not found'
      })
    }
  } catch(err) {
    next(err)
  }
})

router.put('/:uuid', checkAuthentication,  async (req, res, next) => {
  try {
    const availability = await Availability.findOne({
      where: {
        uuid: req.params.uuid
      }
    })
    if(availability) {
      const updateAvailability = await availability.update(req.body)
      res.status(200).send({
        status: 'Success',
        message: 'Availability updated',
        data: updateAvailability
      })
    } else {
      res.status(404).send({
        status: 'Failed',
        message: 'Availability not found'
      })
    }
  } catch(err) {
    next(err)
  }
})

router.delete('/', checkAuthentication,  async (req, res, next) => {
  try {
    const availability = await Availability.findAll({
      where: {
        uuid: req.body.deleteAvailabilities
      }
    })
    if(availability) {
      await Availability.destroy({
        where: {
          uuid: req.body.deleteAvailabilities
        }
      })
      res.status(200).send({
        status: 'Success',
        message: 'availability deleted',
      })
    } else {
      res.status(404).send({
        status: 'Failed',
        message: 'availability not found'
      })
      
    }
  } catch(err) {
    next(err)
  }
})

module.exports = router;
