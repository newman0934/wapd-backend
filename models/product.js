'use strict'
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      cost: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      status: DataTypes.STRING,
      ImageId: DataTypes.INTEGER,
      CategoryId: DataTypes.INTEGER
    },
    {}
  )
  Product.associate = function(models) {
    // associations can be defined here
  }
  return Product
}
