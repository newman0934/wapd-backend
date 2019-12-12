'use strict'
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'Category',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      category: DataTypes.STRING
    },
    {}
  )
  Category.associate = function(models) {
    // associations can be defined here
    Category.hasMany(models.Product)
  }
  return Category
}
