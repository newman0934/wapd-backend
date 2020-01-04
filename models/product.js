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
      status: DataTypes.STRING,
      origin_price: DataTypes.INTEGER,
      sell_price: DataTypes.INTEGER,
      CategoryId: DataTypes.INTEGER
    },
    {}
  )
  Product.associate = function(models) {
    // associations can be defined here
    Product.hasMany(models.CartItem)
    Product.belongsTo(models.Category)
    Product.belongsToMany(models.User, {
      through: models.Favorite,
      foreignKey: 'ProductId',
      as: 'FavoritedUsers'
    })
    Product.belongsToMany(models.Order, {
      as: 'orders',
      through: {
        model: models.OrderItem,
        unique: false
      },
      foreignKey: 'ProductId'
    })
    Product.hasMany(models.Image)
    Product.hasMany(models.ProductStatus)
  }
  return Product
}
