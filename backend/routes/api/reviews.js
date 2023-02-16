//Feature 2: Set up the review router
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


// POST /api/reviews/:reviewId/images (Add an img to a review by reviewId)
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const currUser = req.user.id;
    const review = await Review.findByPk(req.params.reviewId);

    //Check if review exists
    if (!review) {
        return res.status(404).json({
            message: "Review couldn't be found",
            statusCode: 404
        });
    }

    // Check if current user has permission to add new img to review
    if (currUser != review.userId) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        });
    }

    // Cannot add any more images because there is a maximum of 10 images per resource
    const reviewImagesCount = await ReviewImage.count({
        where: { reviewId: review.id }
    });
    if (reviewImagesCount >= 10) {
        return res.status(403).json({
            message: "Maximum number of iamges for this resource was reached",
            statusCode: 403
        });
    }

    const newImage = await ReviewImage.create({ reviewId: review.id, ...req.body });
    const { id, url } = newImage;

    return res.json({id, url});
});

// PUT /api/reviews/:reviewId (Edit review)
router.put('/:reviewId', requireAuth, async (req, res) => {
    const currUser = req.user.id;
    const review = await Review.findByPk(req.params.reviewId);

    //Check if review exists
    if (!review) {
        return res.status(404).json({
            message: "Review couldn't be found",
            statusCode: 404
        });
    }

    // Check permissions of current user
    if (currUser != review.userId) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        });
    }

    //Build up error
    const val = {
        message: "Validation Error",
        statusCode: 400
    }

    //helper fxn error handling
    function errorHandle(val) {
        return res.status(400).json(val);
    }

    //validations
    const {review: reqReview, stars: stars} = req.body;
    if (!reqReview) {
        val.error = "Review text is required";
        return errorHandle(val);
    } else if (!stars || !Number.isInteger(stars) || stars < 0 || stars > 5) {
        val.error = "Stars must be an integer from 1 to 5";
        return errorHandle(val);
    }

    review.update(req.body);
    return res.json(review);
});

// DELETE /api/reviews/:reviewId (Delete a review)
router.delete('/:reviewId', requireAuth, async (req,res) => {
    const currUser = req.user.id;
    const review = await Review.findByPk(req.params.reviewId);

    //Check if review exists
    if (!review) {
        return res.status(404).json({
            message: "Review couldn't be found",
            statusCode: 404
        });
    }

    // Check permissions of current user
    if (currUser != review.userId) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        });
    }

    review.destroy();

    return res.json({
        message: "Successfully deleted",
        statusCode: 200
    });
});





//export the router for use in ./api/index.js
module.exports = router;
