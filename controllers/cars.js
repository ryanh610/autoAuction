const express = require('express')
const { Bid, Car, User } = require('../models')

const router = express.Router()

router.get('/:id', async (req, res) => {
  const car = await Car.findByPk(req.params.id, {
    include: [
      {
        model: Bid,
        as: 'bids',
        include: User
      },
      User
    ],
    order: [
      ['bids', 'price', 'DESC']
    ]
  })
  car.bids = car.bids.map(bid => {
    bid.price = bid.formatPrice()
    bid.get({ plain: true })
  })
  if (!car) return res.status(404).render('errors/404')
  car.get({ plain: true })
  if (car.is_active()) {
    var {days, hours, minutes, seconds} = car.time_values()
  }

  res.render('cars/show', {
    car: car.get({ plain: true}),
    is_active: car.is_active(),
    time_values: {
      days, hours, minutes, seconds
    },
    user: req.session.user
  })
})

module.exports = router