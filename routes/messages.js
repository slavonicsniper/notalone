var express = require('express');
var router = express.Router();
const {Availability, User, InboxMessage, sequelize} = require('../models')
const { checkAuthentication } = require('../services/auth');

router.get('/', checkAuthentication, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        uuid: req.user.uuid
      }
    })
    const receivedMessages = await user.getReceived({
      include: {
        model: User,
        as: 'sender',
        attributes: ['username', 'uuid']
      },
      order: [['createdAt', 'DESC']],
      where: {
        read: false
      }
    })
    const sentMessages = await user.getSent({
      include: {
        model: User,
        as: 'receiver',
        attributes: ['username', 'uuid']
      },
      order: [['createdAt', 'DESC']]
    })
    const answeredMessages = await user.getReceived({
      include: {
        model: User,
        as: 'sender',
        attributes: ['username', 'uuid']
      },
      order: [['updatedAt', 'DESC']],
      where: {
        read: true
      } 
    })
    res.status(200).send({
      status: 'Success',
      mesage: 'Messages fetched',
      data: {
        receivedMessages,
        sentMessages,
        answeredMessages
      }
    })
  } catch(err) {
    next(err)
  }
})

router.post('/', checkAuthentication, async (req, res, next) => {
  try {
    const receiver = await User.findOne({
      where: {
        uuid: req.body.to
      }
    })
    const sender = await User.findOne({
      where: {
        uuid: req.user.uuid
      }
    })
    await sequelize.transaction(async (t) => {
      await InboxMessage.create({
        from: sender.id,
        to: receiver.id,
        message: req.body.message
      }, {
        transaction: t
      })
      if(req.body.messageUuid) {
        await InboxMessage.update({read: true}, {
          where: {
            uuid: req.body.messageUuid
          },
          transaction: t
        })
      }
    });
    res.status(201).send({
      status: 'Success',
      message: 'Message sent'
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
    if(!availability) {
      res.status(404).send({
        status: 'Failed',
        message: 'Availability not found'
      })
    } else {
      res.status(200).send({
        status: 'Success',
        message: 'Availability found',
        data: availability
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
    if(!availability) {
      res.status(404).send({
        status: 'Failed',
        message: 'Availability not found'
      })
    } else {
      const updateAvailability = await availability.update(req.body)
      res.status(200).send({
        status: 'Success',
        message: 'Availability updated',
        data: updateAvailability
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
    if(!availability) {
      res.status(404).send({
        status: 'Failed',
        message: 'availability not found'
      })
    } else {
      await Availability.destroy({
        where: {
          uuid: req.body.deleteAvailabilities
        }
      })
      res.status(200).send({
        status: 'Success',
        message: 'availability deleted',
      })
    }
  } catch(err) {
    next(err)
  }
})

module.exports = router;
