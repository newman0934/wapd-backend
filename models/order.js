'use strict'
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'Order',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      amount: DataTypes.INTEGER,
      status: DataTypes.STRING,
      paymentStatus: DataTypes.STRING,
      phone: DataTypes.STRING,
      paymentMethod: DataTypes.STRING,
      address: DataTypes.STRING,
      receiverName: DataTypes.STRING,
      comment: DataTypes.STRING,
      UserId: DataTypes.INTEGER
    },
    {}
  )
  Order.associate = function(models) {
    // associations can be defined here
    Order.hasMany(models.Coupon)
    Order.belongsToMany(models.Product, {
      as: 'items',
      through: {
        model: models.OrderItem,
        unique: false
      },
      foreignKey: 'OrderId'
    })
    Order.hasMany(models.Payment)
    Order.belongsTo(models.User)
  }
  return Order
}
