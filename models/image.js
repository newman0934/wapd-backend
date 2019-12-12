'use strict'
module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    'Image',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      url: DataTypes.STRING
    },
    {}
  )
  Image.associate = function(models) {
    // associations can be defined here
    Image.hasMany(models.Product)
  }
  return Image
}
