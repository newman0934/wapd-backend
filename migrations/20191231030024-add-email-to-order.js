'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(`Orders`, `email`, {
      type: Sequelize.STRING
    })
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn(`Orders`, `email`)
  }
}
