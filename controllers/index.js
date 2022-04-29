const express = require('express')
const auth_routes = require('./auth_routes')
const apiRoutes = require('./api');
const cars = require('./cars')
const Car = require('../models/Car')
const router = express.Router();


router.use('/api', apiRoutes);
router.use('/users', auth_routes);

router.get('/cars/create', (req, res) => {
  try {
    res.render('cars/create', {
      user: req.session.user
    })
  } catch (err) {
    res.status(500).json(err);
  }
})

router.use('/cars', cars)

router.get('/', async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const user = req.session.user || null

    const carData = await Car.findAll();

    const cars = carData.map((car) => car.get({ plain: true }));
    
    res.render('static/home', {
      user: user,
      cars
    });
    } catch (err) {
      res.status(500).json(err);
    }
  
  
});



// TODO: Create these authentication views 
router.get('/login', (req, res) => res.render('auth/login'));
router.get('/signup', (req, res) => res.render('auth/signup'));

module.exports = router