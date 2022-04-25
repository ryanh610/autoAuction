const express = require('express')
const auth_routes = require('./auth_routes')
const path = require('path')

const router = express.Router()

router.use('/users', auth_routes)

router.get('/', (req, res) => {
  const user = req.session.user
  console.log(user.username)
  res.send(`Hello, ${user.username}`)
})

// TODO: Create these authentication views 
router.get('/login', (req, res) => res.send('auth/login'))
router.get('/signup', (req, res) => res.sendFile(
  path.join(__dirname, '../', 'views', 'signup.html'))
)

module.exports = router