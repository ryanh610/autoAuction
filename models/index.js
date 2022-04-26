const User = require('./User');
const Car = require('./Car');
const Bid = require('./Bid')

User.hasMany(Car, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

User.hasMany(Bid, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
  });

Car.belongsTo(User, {
  foreignKey: 'user_id'
});

Car.hasMany(Bid, {
    foreignKey: 'car_id',
    onDelete: 'CASCADE'
  });

Bid.belongsTo(User, {
    foreignKey: 'user_id'
  });

Bid.hasOne(Car, {
  foreignKey: 'car_id'
});

module.exports = { User, Car, Bid };
