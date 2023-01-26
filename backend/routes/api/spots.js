//Setup spot router
const express = require('express')

const router = express.Router();

const { Spot, Review, ReviewImage, Booking, SpotImage, User, sequelize } = require('../../db/models');
const user = require('../../db/models/user');
const { requireAuth } = require('../../utils/auth');


// GET /api/spots (Get all spots)
router.get('/', async (req, res) => {
    const spots = await Spot.findAll();
    const spotsArr = [];

    for (let spot of spots) {
        spot = spot.toJSON();

        // avgRating property
        const reviews = await Review.findAll({
            where: { spotId: spot.id },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
            ],
            raw: true
        });
        const avgRating = reviews[0].avgRating;

        // handle the null gracefully
        if (avgRating != null) spot.avgRating = avgRating;
        else spot.avgRating = "No ratings yet."


        // add previewImage property
        const img = await SpotImage.findOne({
            where: { spotId: spot.id }
        });

        // prevents reading null error
        if (img) spot.previewImage = img.url;
        else spot.previewImage = 'Image not set.'

        //push into arr
        spotsArr.push(spot);
    }
    return res.json({ Spots: spotsArr })
});

// GET /api/spots/current (Get all Spots owned by current user)
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const spots = await Spot.findAll({
        where: { ownerId: userId }
    });
    const spotsArr = [];

    for (let spot of spots) {
        spot = spot.toJSON();

        const reviews = await Review.findAll({
            where: { spotId: spot.id },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
            ]
        });

        const avgRating = reviews[0].dataValues.avgRating;
        spot.avgRating = avgRating;

        const img = await SpotImage.findOne({
            where: { spotId: spot.id }
        });

        // prevents reading null error
        if (img) spot.previewImage = img.url;
        else spot.previewImage = 'Image not set.'

        spotsArr.push(spot);
    }
    return res.json({Spots: spotsArr})
});

// GET /api/spots/:spotId (Get details of spot from an id)
router.get('/:spotId', async (req, res) => {
    let spot = await Spot.findByPk(req.params.spotId);

    // check if spot exists
    if (!spot) return res.status(404).json({
        message: "Spot cannot be found",
        statusCode: 404
    });

    // convert spot to JSON
    spot = spot.toJSON();

    // add numReviews to spot
    const numReviews = await Review.count({
        where: { spotId: spot.id }
    });
    spot.numReviews = numReviews;

    // add average rating to spot
    const reviews = await Review.findAll({
        where: { spotId: spot.id },
        attributes: [
            [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
        ]
    });
    const avgRating = reviews[0].dataValues.avgRating;
    spot.avgStarRating = avgRating;

    //add SpotImages to spot
    const imgs = await SpotImage.findAll({
        where: { spotId: spot.id },
        attributes: { exclude: ['createdAt', 'updatedAt', 'spotId'] }
    });
    spot.SpotImages = imgs;

    // add Owner to spot
    const owner = await User.findOne({
        where: { id: spot.ownerId },
        attributes: ["id", "firstName", "lastName"]
    });
    spot.Owner = owner;

    res.json(spot)
});


// POST /api/spots (Create a spot)
router.post('/', requireAuth, async (req, res) => {

    // helper function for error handling
    function errorHandle(valError) {
        return res.status(400).json(valError);
    }
    const val = {
        message: "Validation Error",
        statusCode: 400
    };

    // make sure req body parameters are valid
    let { address, city, state, country, lat, lng, name, description, price } = req.body;
    if (!address) {
        val.error = "Street address is required";
        errorHandle(val)
    } else if (!city) {
        val.error = "City is required";
        errorHandle(val)
    } else if (!state) {
        val.error = "State is required";
        errorHandle(val)
    } else if (!country) {
        val.error = "Country is required";
        errorHandle(val)
    } else if (!lat || Number.isNaN(lat) || lat > 90 || lat < -90) {
        val.error = "Latitude is not valid";
        errorHandle(val)
    } else if (!lng || Number.isNaN(lng) || lng > 180 || lng < -180) {
        val.error = "Longitude is not valid";
        errorHandle(val)
    } else if (!name || name.length > 50) {
        val.error = "Name is required and must be less than 50 characters";
        errorHandle(val)
    } else if (!description) {
        val.error = "Description is required";
        errorHandle(val)
    } else if (!price) {
        val.error = "Price per day is required";
        errorHandle(val)
    }

    const ownerId = req.user.id;  // grab current user's id
    const newSpot = await Spot.create({ownerId, ...req.body}); // create new Spot

    return res.status(201).json(newSpot); // return new creation
});


// POST /api/spots/:spotId/images (Add an image by Spot's id)
router.post('/:spotId/images', requireAuth, async (req, res) => {

    const currentUser = req.user.id;
    const spot = await Spot.findByPk(req.params.spotId);

    // Check if Spot exists
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found.",
            statusCode: 404
        });
    }

    // Check current user permissions
    if (currentUser != spot.ownerId) {
        return res.status(403).json({
            message: 'Forbidden',
            statusCode: 403
        });
    }

    //validation checks for SpotImage creation
    let { url, preview } = req.body;
    if (!url) return res.status(400).json({ message: "url is needed."});
    if (!preview) return res.status(400).json({ message: "preview is needed"});
    if (preview != true && preview != false) return res.status(400).json({ message: "preview must be true or false."})

    const newImage = await SpotImage.create({ spotId: req.params.spotId, ...req.body });
    const { id } = newImage;

    return res.status(201).json({id, url, preview})
});

// PUT /api/spots/:spotId
router.put('/:spotId', requireAuth, async (req, res) => {
    const currUser = req.user.id;
    const spot = await Spot.findByPk(req.params.spotId);

    // Check if spot exists
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found.",
            statusCode: 404
        });
    }

    // Check permissions of currUser
    if (currUser != spot.ownerId) {
        return res.status(403).json({
            message: 'Forbidden',
            statusCode: 403
        });
    }

    // Build up error object
    const val = {
        message: 'Validation Error',
        statusCode: 400
    };

    //Helper fxn for error handling
    function errorHandle(val) {
        return res.status(400).json(val);
    }

    // Create validations for reqbody
    const {address, city, state, country, lat, lng, name, description, price} = req.body;

    if (!address) {
        val.error = "Street address is required";
        errorHandle(val);
    } else if (!city) {
        val.error = "City is required";
        errorHandle(val);
    } else if (!state) {
        val.error = "State is required";
        errorHandle(val);
    } else if (!country) {
        val.error = "Country is required";
        errorHandle(val);
    } else if (!lat || Number.isNaN(lat) || lat > 90 || lat < -90) {
        val.error = "Latitude is not valid";
        errorHandle(val);
    } else if (!lng || Number.isNaN(lng) || lng > 180 || lng < -180) {
        val.error = "Longitude is not valid";
        errorHandle(val);
    } else if (!name || name.length > 50) {
        val.error = "Name is required and must be less than 50 characters";
        errorHandle(val);
    } else if (!description) {
        val.error = "Description is required";
        errorHandle(val);
    } else if (!price) {
        val.error = "Price per day is required";
        errorHandle(val);
    }

    spot.update(req.body);
    return res.json(spot);
});

// DELETE /api/spots/:spotId (Delete a Spot)
router.delete('/:spotId', requireAuth, async (req, res) => {
    const currUser = req.user.id;
    const spot = await Spot.findByPk(req.params.spotId);

    // Check if spot exists
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        });
    }

    // Check permissions of currUser
    if (currUser != spot.ownerId) {
        return res.status(403).json({
            message: 'Forbidden',
            statusCode: 403
        });
    }

    // remove the spot
    spot.destroy();

    // send success msg as response
    return res.json({
        message: "Successfully deleted",
        statusCode: 200
    });

});


// Feature 2: Reviews --> GET /api/spots/:spotId/reviews (Get all reviews by spotId)
router.get('/:spotId/reviews', async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    const reviewsArr = [];

    //check if spot exists
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        });
    }

    const reviews = await Review.findAll({
        where: { spotId: spot.id }
    });

    for (let review of reviews) {
        review = review.toJSON();

        //Add User property to each review
        const user = await User.findOne({
            where: { id: review.userId },
            attributes: ['id', 'firstName', 'lastName']
        });
        review.User = user;

        //Add ReviewImages property to each review
        const reviewImages = await ReviewImage.findAll({
            where: { reviewId: review.id },
            attributes: ['id', 'url']
        });
        review.reviewImages = reviewImages;

        reviewsArr.push(review);
    }

    return res.json({ Reviews: reviewsArr })
});


// Feature 2: Reviews --> POST /api/spots/:spotId/reviews
router.post('/:spotId/reviews', requireAuth, async (req, res) => {
    const currUser = req.user.id;
    const spot = await Spot.findByPk(req.params.spotId);

    //check if spot exists
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        });
    }

    const reviews = await Review.findAll({
        where: { spotId: spot.id }
    });

    // check if Review from the current user already exists for the Spot
    for (let review of reviews) {
        if (currUser == review.userId) {
            return res.status(403).json({
                message: "User already has a review for this spot",
                statusCode: 403
            });
        }
    }

    // build up validation error
    const val = {
        message: 'Validation Error',
        statusCode: 400
    };

    // deconstruct the request body
    const { review, stars } = req.body;

    // error handling helper function
    function errorHandle(val) {
        return res.status(400).json(val);
    }

    if (!review) {
        val.error = "Review text is required";
        errorHandle(val);
    } else if (!stars || !Number.isInteger(stars) || stars < 0 || stars > 5) {
        val.error = "Stars must be an integer from 1 to 5";
        errorHandle(val);
    }

    //create and return new review
    const newReview = await Review.create({ userId: currUser, spotId: spot.id, ...req.body });
    return res.status(200).json(newReview);
});


// Feature 3: Bookings --> GET /api/:spotId/bookings (Get all bookings by spotId)
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const currUser = req.user.id;
    const spot = await Spot.findByPk(req.params.spotId);

    //Check if spot exists
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        });
    }

    // NOT spot owner response
    if (currUser != spot.ownerId) {
        const bookings = await Booking.findAll({
            where: { spotId: spot.id },
            attributes: ["spotId", "startDate", 'endDate']
        });
        const bookingsArr = [];

        for (let booking of bookings) {
            booking = booking.toJSON();

            //format the start and end dates
            const startDate = booking.startDate.toISOString().slice(0, 10);
            booking.startDate = startDate;
            const endDate = booking.endDate.toISOString().slice(0, 10);
            booking.endDate = endDate;

            bookingsArr.push(booking);
        }

        return res.json({ Bookings: bookingsArr });
    }
    // spot owner response
    else {
        const bookings = await Booking.findAll({
            where: { spotId: spot.id }
        });

        const bookingsArr = [];

        for (let booking of bookings) {
            booking = booking.toJSON();

            //Add user property to booking
            const user = await User.findOne({
                where: { id: booking.userId },
                attributes: ['id', 'firstName', 'lastName']
            });
            booking.User = user;

            //format start and end date as yyyy-mm-dd
            const startDate = booking.startDate.toISOString().slice(0, 10);
            booking.startDate = startDate;
            const endDate = booking.endDate.toISOString().slice(0, 10);
            booking.endDate = endDate;

            //format createdAt and updatedAt to yyyy-mm-dd hh:mm:ss
            const createdAtDate = booking.createdAt.toISOString().slice(0, 10);
            const createdAtTime = booking.createdAt.toISOString().slice(11, 19);
            booking.createdAt = `${createdAtDate} ${createdAtTime}`;
            const updatedAtDate = booking.updatedAt.toISOString().slice(0, 10);
            const updatedAtTime = booking.updatedAt.toISOString().slice(11, 19);
            booking.updatedAt = `${updatedAtDate} ${updatedAtTime}`;

            bookingsArr.push(booking);
        }

        return res.json({ Bookings: bookingsArr });
    }
});


// Feature 3: Bookings --> POST /api/spots/:spotId/bookings (Create booking by spotId)
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const currUser = req.user.id;
    const spot = await Spot.findByPk(req.params.spotId);

    // check if spot exists
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        });
    }

    // check user permissions
    if (currUser == spot.ownerId) {
        return res.status(400).json({
            message: "Booking cannot be made by owner of spot",
            statusCode: 403
        });
    }

    // validate input
    let {startDate, endDate} = req.body;

    // start date must be before end date
    if (startDate >= endDate) {
        return res.status(400).json({
            message: "Validation error",
            statusCode: 400,
            error: {
                endDate: "endDate cannot be on or before startDate"
            }
        });
    }

    //check for booking conflicts
    const bookings = await Booking.findAll({
        where: {spotId: spot.id}
    });

    for (let booking of bookings) {

        const bookingStartDate = booking.startDate.toISOString().slice(0, 10);
        const bookingEndDate = booking.endDate.toISOString().slice(0, 10);

        console.log(req.body.startDate, booking.startDate)
        if (req.body.startDate >= bookingStartDate && req.body.startDate <= bookingEndDate) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                statusCode: 403,
                error: {
                    startDate: "Start date conflicts with an existing booking"
                }
            });
        }
        if (req.body.endDate >= bookingStartDate && req.body.endDate <= bookingEndDate) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                statusCode: 403,
                error: {
                    endDate: "End date conflicts with an existing booking"
                }
            });
        }
    }

    // create new booking
    let newBooking = await Booking.create({
        spotId: spot.id,
        userId: currUser,
        ...req.body
    });
    newBooking = newBooking.toJSON();


    //format new booking properties (startDate, endDate, createdAt, updatedAt)
    startDate = newBooking.startDate.toISOString().slice(0, 10);
    newBooking.startDate = startDate;
    endDate = newBooking.endDate.toISOString().slice(0, 10);
    newBooking.endDate = endDate;

    const createdAtDate = newBooking.createdAt.toISOString().slice(0, 10);
    const createdAtTime = newBooking.createdAt.toISOString().slice(11, 19);
    newBooking.createdAt = `${createdAtDate} ${createdAtTime}`;
    const updatedAtDate = newBooking.updatedAt.toISOString().slice(0, 10);
    const updatedAtTime = newBooking.updatedAt.toISOString().slice(11, 19);
    newBooking.updatedAt = `${updatedAtDate} ${updatedAtTime}`;


    return res.status(200).json(newBooking);
});



//export the router to use in ./api/index.js
module.exports = router;
