'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(`CartItems`, `CartId`)
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.addColumn(`CartItems`, `CartId`, {
      type: Sequelize.INTEGER
    })
  }
}
