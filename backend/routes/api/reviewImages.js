// Setup ReviewImages router
const express = require('express')

const router = express.Router();

const { Spot, Review, ReviewImage, Booking, SpotImage, User, sequelize } = require('../../db/models');
const user = require('../../db/models/user');
const { requireAuth } = require('../../utils/auth');



// DELETE /api/review-images/:imageId (Delete a Review Image)
router.delete('/:imageId', requireAuth, async (req, res) => {
    const currUser = req.user.id;
    const reviewImage = await ReviewImage.findByPk(req.params.imageId)

    //check if review image exists
    if (!reviewImage) {
        return res.status(404).json({
            message: "Review Image couldn't be found",
            statusCode: 404
        });
    }


    //review must belong to current user
    const review = await Review.findByPk(reviewImage.reviewId);

    if (currUser != review.userId) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        });
    }

    //remove the review image
    reviewImage.destroy();

    //send success response
    res.status(200).json({
        message: "Successfully deleted",
        statusCode: 200
    });

});








module.exports = router;
