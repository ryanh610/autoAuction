const express = require('express')
const bcrypt = require('bcrypt')
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
router.post('/login', async (req, res) => {
  const user = await User.findOne({ where: { username: req.body.username }})

  if (!user) return res.redirect('/login')

  authenticated = await bcrypt.compare(req.body.password, user.password)

  if (authenticated) {
    req.session.save(() => {
      req.session.user = user.get({ plain: true })
  
      res.redirect('/')
    })
  } else {
    // Send flash message that 'username/password is incorrect
    res.redirect('/login')
  }

})

// TODO: Log out user, destroy session
router.delete('/logout', (req, res) => {
  console.log('hi')
  if (!req.session.user) return res.redirect('/')
  req.session.destroy(() => {
    res.redirect('/') // Probably not necessary with our implementation
  })
})

module.exports = router