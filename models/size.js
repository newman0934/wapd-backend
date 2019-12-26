'use strict'
module.exports = (sequelize, DataTypes) => {
  const Size = sequelize.define(
    'Size',
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
  Size.associate = function(models) {
    // associations can be defined here
    Size.hasMany(models.ProductStatus)
  }
  return Size
}
