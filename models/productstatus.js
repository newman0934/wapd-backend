'use strict'
module.exports = (sequelize, DataTypes) => {
  const ProductStatus = sequelize.define(
    'ProductStatus',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      sales: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
      ColorId: DataTypes.INTEGER,
      ProductId: DataTypes.INTEGER,
      SizeId: DataTypes.INTEGER
    },
    {}
  )
  ProductStatus.associate = function(models) {
    // associations can be defined here
    ProductStatus.belongsTo(models.Product)
    ProductStatus.belongsTo(models.Color)
    ProductStatus.belongsTo(models.Size)
  }
  return ProductStatus
}
