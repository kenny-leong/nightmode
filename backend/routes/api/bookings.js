//Feature 3: Set up bookings router

const express = require('express');

const router = express.Router();

const { Booking, Spot, SpotImage, Review, ReviewImage, User, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

// GET /api/bookings/current (Get all current user's bookings)
router.get('/current', requireAuth, async (req, res) => {
    const currUser = req.user.id;
    const bookings = await Booking.findAll({
        where: { userId: currUser }
    });

    const bookingsArr = [];

    for (let booking of bookings) {
        booking = booking.toJSON();

        //Add spot property to booking
        let spot = await Spot.findOne({
            where: { id: booking.spotId },
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });
        spot = spot.toJSON();

            //add previewImage property to Spot obj
            const previewImg = await SpotImage.findOne({
                where: { preview: true },
                raw: true
            });
            spot.previewImage = previewImg.url;

        booking.Spot = spot;

        const startDate = booking.startDate.toISOString().slice(0, 10);
        booking.startDate = startDate;
        const endDate = booking.endDate.toISOString().slice(0, 10);
        booking.endDate = endDate;

    }


});
