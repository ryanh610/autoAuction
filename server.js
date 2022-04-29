const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const routes = require('./controllers')
const session = require('express-session')
const sequelize = require('./config/db')
const { engine } = require('express-handlebars')
const SequelizeSessionStore = require('connect-session-sequelize')(session.Store)

dotenv.config()
const PORT = process.env.PORT  || 3001

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
  secret: process.env.APP_KEY,
  resave: false,
  saveUninitialized: true,
  store: new SequelizeSessionStore({
    db: sequelize
  })
}))


app.engine('.hbs', engine({ extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(routes)

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`))
})