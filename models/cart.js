'use strict'
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define(
    'Cart',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      }
    },
    {}
  )
  Cart.associate = function(models) {
    // associations can be defined here
  }
  return Cart
}
