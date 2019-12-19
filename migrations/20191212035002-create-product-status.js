'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ProductStatuses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sales: {
        type: Sequelize.INTEGER
      },
      stock: {
        type: Sequelize.INTEGER
      },
      ColorId: {
        type: Sequelize.INTEGER
      },
      ProductId: {
        type: Sequelize.INTEGER
      },
      SizeId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ProductStatuses')
  }
}
