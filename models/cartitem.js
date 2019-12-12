'use strict'
module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define(
    'CartItem',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      stock: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
      ProductId: DataTypes.INTEGER,
      CartId: DataTypes.INTEGER
    },
    {}
  )
  CartItem.associate = function(models) {
    // associations can be defined here
  }
  return CartItem
}
