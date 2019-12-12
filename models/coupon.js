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
      coupon_code: DataTypes.STRING,
      discount_amount: DataTypes.INTEGER,
      OrderId: DataTypes.INTEGER
    },
    {}
  )
  Coupon.associate = function(models) {
    // associations can be defined here
    Coupon.belongsTo(models.Order)
  }
  return Coupon
}
