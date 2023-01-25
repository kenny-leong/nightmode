//Setup spot router
const express = require('express')

const router = express.Router();

const { Spot, Review, SpotImage, User, sequelize } = require('../../db/models');
const user = require('../../db/models/user');
const { requireAuth } = require('../../utils/auth');


// GET /api/spots (Get all spots)
router.get('/', async (req, res) => {
    const spots = await Spot.findAll();
    const spotsArr = [];

    for (let spot of spots) {
        spot = spot.toJSON();
        const reviews = await Review.findAll({
            where: { spotId: spot.id },
            attributes: [
                [sequelize.fn('count', sequelize.col('stars')), 'countRatings'],
                [sequelize.fn('sum', sequelize.col('stars')), 'sumRatings']
            ]
        });

        const avgRating = reviews[0].dataValues.sumRatings / reviews[0].dataValues.countRatings;
        spot.avgRating = avgRating;

        const img = await SpotImage.findOne({
            where: { spotId: spot.id }
        });
        spot.previewImage = img.url;

        spotsArr.push(spot);
    }
    return res.json({Spots: spotsArr})
});

// GET /api/spots/:current (Get all Spots owned by current user)
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
                [sequelize.fn('count', sequelize.col('stars')), 'countRatings'],
                [sequelize.fn('sum', sequelize.col('stars')), 'sumRatings']
            ]
        });

        const avgRating = reviews[0].dataValues.sumRatings / reviews[0].dataValues.countRatings;
        spot.avgRating = avgRating;

        const img = await SpotImage.findOne({
            where: { spotId: spot.id }
        });
        spot.previewImage = img.url;

        spotsArr.push(spot);
    }
    return res.json({Spots: spotsArr})
});

// GET /api/spots/:spotId (Get details of spot from spotId)
router.get('/:spotId', async (req, res) => {
    let spot = await Spot.findByPk(req.params.spotId);

    // check if spot exists
    if (!spot) return res.status(404).json({
        message: "Spot cannot be found",
        statusCode: 404
    });

    // convert spot to JSON
    spot = spot.toJSON();

    // add average rating to spot
    const reviews = await Review.findAll({
        where: { spotId: spot.id },
        attributes: [
            [sequelize.fn('count', sequelize.col('stars')), 'countRatings'],
            [sequelize.fn('sum', sequelize.col('stars')), 'sumRatings']
        ]
    });
    const avgRating = reviews[0].dataValues.sumRatings / reviews[0].dataValues.countRatings;
    spot.avgRating = avgRating;

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


    function errorHandle(valError) {
        return res.status(400).json(valError);
    }
    const val = {};

    // make sure req body parameters are valid
    let {address, city, state, country, lat, lng, name, description, price} = req.body;
    if (!address) {
        val.error = "Street address is required";
        errorHandle(val.error)
    } else if (!city) {
        val.error = "City is required";
        errorHandle(val.error)
    } else if (!state) {
        val.error = "State is required";
        errorHandle(val.error)
    } else if (!country) {
        val.error = "Country is required";
        errorHandle(val.error)
    } else if (!lat || Number.isNaN(lat) || lat > 90 || lat < -90) {
        val.error = "Latitude is not valid";
        errorHandle(val.error)
    } else if (!lng || Number.isNaN(lng) || lng > 180 || lng < -180) {
        val.error = "Longitude is not valid";
        errorHandle(val.error)
    } else if (!name || name.length > 50) {
        val.error = "Name is required and must be less than 50 characters";
        errorHandle(val.error)
    } else if (!description) {
        val.error = "Description is required";
        errorHandle(val.error)
    } else if (!price) {
        val.error = "Price per day is required";
        errorHandle(val.error)
    }

    const ownerId = req.user.id;

    const newSpot = await Spot.create({ownerId, ...req.body});

    return res.status(201).json(newSpot);
});



//export the router to use in ./api/index.js
module.exports = router;
