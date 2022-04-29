const express = require('express')
const { Bid, Car, User } = require('../models')

const router = express.Router()

router.get('/', async (req, res) => {
    try {
      const user = req.session.user || null
      const carData = await Car.findAll();
      const cars = carData.map((car) => car.get({ plain: true }));
  
      res.render('partials/bid_details', {
        user: user,
        cars
      });
  
    } catch (err) {
      res.status(500).json(err);
    }
    
  })

module.exports = router