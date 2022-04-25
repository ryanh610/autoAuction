const express = require('express')
const res = require('express/lib/response')
const User = require('../models/User')

const router = express.Router()

// TODO: Create a new user, authenticate them
router.post('/signup', async (req, res) => {
  if (!req.body.username || !req.body.password) return res.redirect('/signup')
  const user = await User.create({
    username: req.body.username,
    password: req.body.password
  })
  req.session.save(() => {
    req.session.user = user.get({ plain: true })

    res.redirect('/')
  })
})
// TODO: Log in user stored in database

// TODO: Log out user, destroy session

module.exports = router