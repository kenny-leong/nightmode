//Feature 2: Set up the router
const express = require('express');

const router = express.Router();

const { Spot, SpotImage, Review, ReviewImage, User, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

// GET /api/reviews/current (Get all reviews of the current user)
router.get('/current', requireAuth, async (req, res) => {
    const currUser = req.user.id;
    const reviewsArr = [];

    const reviews = await Review.findAll({
        where: { userId: currUser }
    });

    for (let review of reviews) {
        review = review.toJSON();

        //Add user property to review
        const user = await User.findOne({
            where: { id: currUser },
            attributes: ['id', 'firstName', 'lastName']
        });
        review.User = user;

        //Add spot property to review
        let spot = await Spot.findOne({
            where: { id: review.spotId },
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });
        spot = spot.toJSON();

            //Add previewImage property to spot
            const previewImage = await SpotImage.findOne({
                where: { preview: true },
                raw: true
            });
        spot.previewImage = previewImage.url
        review.Spot = spot;

        //Add reviewImages property to review
        const reviewImages = await ReviewImage.findAll({
            where: { reviewId: review.id },
            attributes: ['id', 'url']
        });
        review.reviewImages = reviewImages;

        //push to array
        reviewsArr.push(review);
    }

    return res.json({ Reviews: reviewsArr })
});



//export the router for use in ./api/index.js
module.exports = router;
