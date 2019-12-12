'use strict'
module.exports = (sequelize, DataTypes) => {
  const ProductSize = sequelize.define(
    'ProductSize',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      size: DataTypes.STRING
    },
    {}
  )
  ProductSize.associate = function(models) {
    // associations can be defined here
  }
  return ProductSize
}
