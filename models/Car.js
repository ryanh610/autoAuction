const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { getTimeDifference } = require('@baggie/math')
const { DateTime } = require('luxon')

class Car extends Model {
  is_active() {
    return (new Date) < this.ending_date
    console.log(this);
  }

  time_values() {
    if (!this.is_active()) return
    
    const now = DateTime.fromJSDate(new Date(Date.now()))

    const ending = new Date(Date.parse(this.ending_date))
    ending.setHours(ending.getHours() + 4)

    const end = DateTime.fromJSDate(ending)
    return getTimeDifference(end.toMillis(), now.toMillis())
  }
}


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
      type: DataTypes.STRING,
      allowNull: false
    },
    mileage: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    ending_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },
  {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: 'car',
  }
  
);

module.exports = Car;
