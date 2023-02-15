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
        url: "https://media.timeout.com/images/103920796/image.jpg",
        preview: true
      },
      {
        spotId: 2,
        url: "https://wp-tid.zillowstatic.com/bedrock/app/uploads/sites/26/nyc-apartments-for-3200-lic-6fadb8.jpg",
        preview: false
      },
      {
        spotId: 3,
        url: "https://thumbs.cityrealty.com/assets/smart/736x/webp/2/22/22ca6350cd0dcc474556e1e06bd8144482a45135/15-central-park-west-01.jpg",
        preview: false
      },
      {
        spotId: 4,
        url: 'https://majestichotelgroup.com/web/majestic/homepage/mobile/slider/00majestic-hotel-and--spa-fachada.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/204253953.jpg?k=4ad36497a401be332589e2fb06a290f322f71d8845bd2fed4bb4129b3cf8f048&o=&hp=1',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://image-tc.galaxy.tf/wijpeg-9vualzt3dbue0hi00ba4q49ub/chatwalhotelnyc-c-004-build-crop.jpg?width=1920',
        preview: false
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5, 6] }
    }, {});
  }
};
