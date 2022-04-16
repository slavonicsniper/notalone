var express = require('express');
var router = express.Router();
const {Activity, User, sequelize} = require('../models')
const { checkAuthentication } = require('../services/auth');
const { Op } = require('@sequelize/core')

router.get('/', checkAuthentication, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        uuid: req.user.uuid
      }
    })
    const activities = await user.getActivities({
      joinTableAttributes: []
    })
    if(activities.length > 0) {
      res.status(200).send({
        status: 'Success',
        message: 'Activities found',
        data: activities
      })
    } else {
      res.status(404).send({
        status: 'Failed',
        message: 'No activities found'
      })
    }
  } catch(err) {
    next(err)
  }
})

router.get('/all', checkAuthentication, async (req, res, next) => {
  try {
    const activities = await Activity.findAll()
    if(activities.length > 0) {
      res.status(200).send({
        status: 'Success',
        message: 'Activities found',
        data: activities
      })
    } else {
      res.status(404).send({
        status: 'Failed',
        message: 'No activities found'
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
      const activities = {}
      if(req.body.existingActivities.length > 0) {
        const existingActivities = await Activity.findAll({
          where: {
            [Op.or]: req.body.existingActivities
          }
        })
        await user.addActivities(existingActivities, {
          transaction: t
        })
        activities.existingActivities = existingActivities
      }
      if(req.body.newActivities.length > 0) {
        const newActivities = await Activity.bulkCreate(req.body.newActivities, {
          transaction: t
        })
        await user.addActivities(newActivities, {
          transaction: t
        })
        activities.newActivities = newActivities
      }
      return activities
    });
    res.status(201).send({
      status: 'Success',
      message: 'Activities created',
      data: result
    })
  } catch(err) {
    next(err)
  }
})

router.get('/:uuid', checkAuthentication,  async (req, res, next) => {
  try {
    const activity = await Activity.findOne({
      where: {
        uuid: req.params.uuid
      }
    })
    if(activity) {
      res.status(200).send({
        status: 'Success',
        message: 'Activity found',
        data: activity
      })
    } else {
      res.status(404).send({
        status: 'Failed',
        message: 'Activity not found'
      })
    }
  } catch(err) {
    next(err)
  }
})

router.delete('/', checkAuthentication,  async (req, res, next) => {
  try {
    await sequelize.transaction(async (t) => {
      const user = await User.findOne({
        where: {
          uuid: req.user.uuid
        }
      })
      if(req.body.deleteActivities.length > 0) {
        const deleteActivities = await Activity.findAll({
          where: {
            uuid: req.body.deleteActivities
          }
        })
        await user.removeActivities(deleteActivities, {
          transaction: t
        })
      }
    });
    res.status(201).send({
      status: 'Success',
      message: 'Activities deleted',
    })
  } catch(err) {
    next(err)
  }
})

module.exports = router;
