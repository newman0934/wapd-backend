'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      birthday: DataTypes.DATEONLY,
      role: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING
    },
    {}
  )
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.CartItem)
    User.belongsToMany(models.Product, {
      through: models.Favorite,
      foreignKey: 'UserId',
      as: 'FavoritedProducts'
    })
    User.hasMany(models.Order)
    User.hasMany(models.Token)
  }
  return User
}
