// Setup ReviewImages router
const express = require('express')

const router = express.Router();

const { Spot, Review, ReviewImage, Booking, SpotImage, User, sequelize } = require('../../db/models');
const user = require('../../db/models/user');
const { requireAuth } = require('../../utils/auth');



// DELETE /api/review-images/:imageId (Delete a Review Image)
router.delete('/:imageId', requireAuth, async (req, res) => {

});








module.exports = router;
