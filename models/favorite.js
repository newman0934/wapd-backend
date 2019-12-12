'use strict'
module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define(
    'Favorite',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      UserId: DataTypes.INTEGER,
      ProductId: DataTypes.INTEGER
    },
    {}
  )
  Favorite.associate = function(models) {
    // associations can be defined here
  }
  return Favorite
}
