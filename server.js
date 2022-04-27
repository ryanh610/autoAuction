const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const routes = require('./controllers')
const session = require('express-session')
const sequelize = require('./config/db')
const { engine } = require('express-handlebars')
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
app.use(express.static(path.join(__dirname, 'public')))

app.engine('.hbs', engine({ extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(routes)

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`))
})