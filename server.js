const express = require('express')
const dotenv = require('dotenv')
const routes = require('./routes')
const session = require('express-session')
const sequelize = require('./config/db')
const SequelizeSessionStore = require('connect-session-sequelize')(session.Store)

dotenv.config()
const PORT = 3001 || process.env.PORT

const app = express()

app.use(session({
  secret: process.env.APP_KEY,
  resave: false,
  saveUninitialized: true,
  store: new SequelizeSessionStore({
    db: sequelize
  })
}))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(routes)

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`))
})