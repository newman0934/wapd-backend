'use strict'
module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    'OrderItem',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      price: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      color: DataTypes.STRING,
      size: DataTypes.STRING,
      OrderId: DataTypes.INTEGER,
      ProductId: DataTypes.INTEGER
    },
    {}
  )
  OrderItem.associate = function(models) {
    // associations can be defined here
  }
  return OrderItem
}
