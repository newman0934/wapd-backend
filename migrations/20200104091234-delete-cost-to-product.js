'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(`Products`, `cost`)
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.addColumn(`Products`, `cost`, {
      type: Sequelize.INTEGER
    })
  }
}
