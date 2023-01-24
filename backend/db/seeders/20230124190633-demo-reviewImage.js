'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: "https://www.energy.gov/sites/default/files/styles/full_article_width/public/door_5481543.jpg?itok=l_TeNrgh"
      },
      {
        reviewId: 2,
        url: "https://burst.shopifycdn.com/photos/secret-garden-wooden-door-with-wreath.jpg?width=1200&format=pjpg&exif=1&iptc=1"
      },
      {
        reviewId: 3,
        url: "https://dam.thdstatic.com/content/production/WIThzTZnXkhTB0aSZrTm_Q/zjjM6JPbIVZY0cB6FjF_qg/Original%20file/JeldWen_EntryDoor_Denim_301987930.jpg?im=Crop,rect=(531.8871995192308,339.3255859375,4221.4970552884615,2638.4356595552886)"
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
