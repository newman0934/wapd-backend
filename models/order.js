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
      total_price: DataTypes.INTEGER,
      shipping_status: DataTypes.STRING,
      shipping_method: DataTypes.STRING,
      payment_status: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      payment_method: DataTypes.STRING,
      address: DataTypes.STRING,
      receiver_name: DataTypes.STRING,
      comment: DataTypes.STRING,
      sn: DataTypes.BIGINT,
      UserId: DataTypes.INTEGER,
      CouponId: DataTypes.INTEGER
    },
    {}
  )
  Order.associate = function(models) {
    // associations can be defined here
    Order.belongsTo(models.Coupon)
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
