'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(`OrderItems`, `product_name`, {
      type: Sequelize.STRING
    })
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn(`OrderItems`, `product_name`)
  }
}
