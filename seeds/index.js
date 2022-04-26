const sequelize = require('../config/db')
const User = require("../models/User");

const users = [
  {
    username: 'ryan_howley',
    password: 'password'
  },
  {
    username: 'gus_madden',
    password: 'password'
  },
  {
    username: 'matthew_carson',
    password: 'password'
  }
]

const run = async () => {
  await sequelize.sync({ force: true })
  await User.bulkCreate(users, {
    individualHooks: true
  })
  console.log('---Users table seeded successfully!---')
  process.exit(0)
}

run()