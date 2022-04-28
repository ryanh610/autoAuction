const sequelize = require('../config/db')
const { Bid, Car, User } = require('../models')

const cars = require('./cars.json');
const bids = require('./bids.json');
const users = require('./users.json');

const run = async () => {
  await sequelize.sync({ force: true })
  await User.bulkCreate(users, {
    individualHooks: true
  })
  console.log('---Users table seeded successfully!---')
  await Car.bulkCreate(cars, {
    individualHooks: true
  })
  console.log('---Cars table seeded successfully---')
  await Bid.bulkCreate(bids, {
    individualHooks: true
  })
  console.log('---Bids table seeded successfully---')
  process.exit(0)
}

run()