'use strict';
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    sn: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    paymentMethod: DataTypes.STRING,
    paidAt: DataTypes.DATE,
    params: DataTypes.TEXT
  }, {});
  Payment.associate = function(models) {
    // associations can be defined here
  };
  return Payment;
};