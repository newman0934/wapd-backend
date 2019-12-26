'use strict'
module.exports = (sequelize, DataTypes) => {
  const Color = sequelize.define(
    'Color',
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
  Color.associate = function(models) {
    // associations can be defined here
    Color.hasMany(models.ProductStatus)
  }
  return Color
}
