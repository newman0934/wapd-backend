'use strict'
module.exports = (sequelize, DataTypes) => {
  const Coupon = sequelize.define(
    'Coupon',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      couponCode: DataTypes.STRING,
      discountAmount: DataTypes.INTEGER,
      OrderId: DataTypes.INTEGER
    },
    {}
  )
  Coupon.associate = function(models) {
    // associations can be defined here
  }
  return Coupon
}
