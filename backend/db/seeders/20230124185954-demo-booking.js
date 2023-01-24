'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 2,
        startDate: new Date(2022, 5, 15),
        endDate: new Date(2022, 5, 27)
      },
      {
        spotId: 2,
        userId: 3,
        startDate: new Date(2022, 6, 5),
        endDate: new Date(2022, 6, 8)
      },
      {
        spotId: 3,
        userId: 1,
        startDate: new Date(2021, 7, 4),
        endDate: new Date(2021, 7, 10)
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
