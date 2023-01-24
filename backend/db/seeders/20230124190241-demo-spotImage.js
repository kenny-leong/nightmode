'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: "https://thumbs.cityrealty.com/assets/smart/736x/webp/1/16/1655f4e3904fb79cb987ab7755d2b3f4b8f37f88/1-city-point.jpg",
        preview: true
      },
      {
        spotId: 2,
        url: "https://wp-tid.zillowstatic.com/bedrock/app/uploads/sites/26/nyc-apartments-for-3200-lic-6fadb8.jpg",
        preview: true
      },
      {
        spotId: 3,
        url: "https://thumbs.cityrealty.com/assets/smart/736x/webp/2/22/22ca6350cd0dcc474556e1e06bd8144482a45135/15-central-park-west-01.jpg",
        preview: true
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
