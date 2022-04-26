const express = require('express')
const auth_routes = require('./auth_routes')
const path = require('path')

const router = express.Router()

router.use('/users', auth_routes)

router.get('/', (req, res) => {
  const user = req.session.user || null
  res.render('static/home', {
    user: user
  })
})

// TODO: Create these authentication views 
router.get('/login', (req, res) => res.render('auth/login'))
router.get('/signup', (req, res) => res.render('auth/signup'))

module.exports = router