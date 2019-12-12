'use strict'
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    'Payment',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      sn: DataTypes.INTEGER,
      amount: DataTypes.INTEGER,
      payment_method: DataTypes.STRING,
      payment_status: DataTypes.STRING,
      paid_at: DataTypes.DATE,
      params: DataTypes.TEXT,
      OrderId: DataTypes.INTEGER
    },
    {}
  )
  Payment.associate = function(models) {
    // associations can be defined here
    Payment.belongsTo(models.Order)
  }
  return Payment
}
