'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Users';
    await queryInterface.addColumn(options, 'firstName', Sequelize.STRING);
    await queryInterface.addColumn(options, 'lastName', Sequelize.STRING);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    await queryInterface.removeColumn(options, 'firstName');
    await queryInterface.removeColumn(options, 'lastName');
  }
};
