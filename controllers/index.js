const express = require('express')
const auth_routes = require('./auth_routes')
const apiRoutes = require('./api');
const cars = require('./cars')

const router = express.Router();


router.use('/api', apiRoutes);
router.use('/users', auth_routes);

router.use('/cars', cars)

router.get('/', (req, res) => {
  const user = req.session.user || null
  res.render('static/home', {
    user: user
  });
});

router.get('/cars/create', (req, res) => {
  res.render('cars/create')
})

// TODO: Create these authentication views 
router.get('/login', (req, res) => res.render('auth/login'));
router.get('/signup', (req, res) => res.render('auth/signup'));

module.exports = router