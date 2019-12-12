'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductColor = sequelize.define('ProductColor', {
    color: DataTypes.STRING
  }, {});
  ProductColor.associate = function(models) {
    // associations can be defined here
  };
  return ProductColor;
};