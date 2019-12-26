'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(`Users`, `birthday`, {
      type: Sequelize.DATEONLY
    })
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn(`Users`, `birthday`)
  }
}
