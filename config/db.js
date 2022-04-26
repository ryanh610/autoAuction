const Sequelize = require('sequelize')
const dotenv = require('dotenv')

dotenv.config()

// TODO: Update this for use with Heroku
const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD, 
  {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
  }
)

module.exports = sequelize