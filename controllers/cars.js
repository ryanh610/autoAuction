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
  car.bids = car.bids.map(bid => bid.get({ plain: true }))

  if (!car) return res.status(404).render('errors/404')

  res.render('cars/show', {
    car: car.get({ plain: true }),
    user: req.session.user
  })
})

module.exports = router