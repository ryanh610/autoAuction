const Sequelize = require('sequelize')
const dotenv = require('dotenv')

dotenv.config()

let sequelize

if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL)
} else {
  sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD, 
    {
      host: 'localhost',
      dialect: 'mysql',
      port: 3306,
      logging: false
    }
  )
}

module.exports = sequelize