'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: "123 Potato Lane",
        city: "San Francisco",
        state: 'California',
        country: "USA",
        lat: 37.7645358,
        lng: 43.2131242,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 111
      },
      {
        ownerId: 2,
        address: "123 Kenken Lane",
        city: "Vampire Central",
        state: 'Florida',
        country: "USA",
        lat: 27.6648358,
        lng: 43.1231231,
        name: "Big Apple",
        description: "Place where Thomas lives",
        price: 999.62
      },
      {
        ownerId: 3,
        address: "31 Iowa Street",
        city: "Quatar",
        state: 'Rhode Island',
        country: "USA",
        lat: 41.5801358,
        lng: 12.2131231,
        name: "Lala House",
        description: "Place where Lala lives",
        price: 555.55
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ["App Academy", "Big Apple", "Lala House"] }
    }, {});
  }
};
