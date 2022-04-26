const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Bid extends Model {}

Bid.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    car_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'cars',
          key: 'id',
        }
    }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'bids',
  }
);

module.exports = Bid;
