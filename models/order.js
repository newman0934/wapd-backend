'use strict'
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'Order',
    {
      amount: DataTypes.INTEGER,
      status: DataTypes.STRING,
      paymentStatus: DataTypes.STRING,
      phone: DataTypes.STRING,
      paymentMethod: DataTypes.STRING,
      address: DataTypes.STRING,
      receiverName: DataTypes.STRING,
      sn: DataTypes.INTEGER,
      comment: DataTypes.STRING,
      UserId: DataTypes.INTEGER
    },
    {}
  )
  Order.associate = function(models) {
    // associations can be defined here
  }
  return Order
}
