'use strict'
module.exports = (sequelize, DataTypes) => {
  const ProductColor = sequelize.define(
    'ProductColor',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      color: DataTypes.STRING
    },
    {}
  )
  ProductColor.associate = function(models) {
    // associations can be defined here
  }
  return ProductColor
}
