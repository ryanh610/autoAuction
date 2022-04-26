const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Car extends Model {}

Car.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    model: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
      type: DataTypes.STRING,
    },
    year: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'Car',
  }
);

module.exports = Car;
