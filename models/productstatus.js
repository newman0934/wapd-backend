'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductStatus = sequelize.define('ProductStatus', {
    sales: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    ColorId: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER,
    SizeId: DataTypes.INTEGER
  }, {});
  ProductStatus.associate = function(models) {
    // associations can be defined here
  };
  return ProductStatus;
};