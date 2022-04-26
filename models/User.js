const bcrypt = require('bcrypt')
const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/db')

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [8]
    }
  }
}, {
  sequelize,
  hooks: {
    beforeCreate: async user => {
      user.username = user.username.toLowerCase()
      user.password = await bcrypt.hash(user.password, 10)

      return user
    }
  }
})

module.exports = User
