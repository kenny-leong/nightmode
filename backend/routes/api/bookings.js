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

        // format the start and end date to yyyy-mm-dd
        const startDate = booking.startDate.toISOString().slice(0, 10);
        booking.startDate = startDate;
        const endDate = booking.endDate.toISOString().slice(0, 10);
        booking.endDate = endDate;

        //format createdAt and updatedAT as yyyy-mm-dd hh:mm:ss
        const createdAtDate = booking.createdAt.toISOString().slice(0, 10);
        const createdAtTime = booking.createdAt.toISOString().slice(11, 19);
        booking.createdAt = `${createdAtDate} ${createdAtTime}`;
        const updatedAtDate = booking.updatedAt.toISOString().slice(0, 10);
        const updatedAtTime = booking.updatedAt.toISOString().slice(11, 19);
        booking.updatedAt = `${updatedAtDate} ${updatedAtTime}`;

        bookingsArr.push(booking);
    }
    return res.json({ Bookings: bookingsArr })
});



// PUT /api/bookings/:bookingId (Edit a booking)
router.put('/:bookingId', requireAuth, async (req, res) => {
    const currUser = req.user.id;
    let booking = await Booking.findByPk(req.params.bookingId);

    //Check if booking exists
    if (!booking) {
        return res.status(404).json({
            message: "Booking couldn't be found",
            statusCode: 404
        });
    }

    //Check if booking belongs to current user
    if (currUser != booking.userId) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        });
    }

    // validate input
    let {startDate, endDate} = req.body;

    //format reqbody dates as comparable values with getTime()
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    startDate = startDate.getTime();
    endDate = endDate.getTime();

    // start date must be before end date
    if (startDate >= endDate) {
        return res.status(400).json({
            message: "Validation error",
            statusCode: 400,
            error: {
                endDate: "endDate cannot come before startDate"
            }
        });
    }

    // create a variable storing today's date
    let todayDate = new Date();
    todayDate = todayDate.getTime();

    // past bookings can't be modified
    if (todayDate >= endDate) {
        return res.status(403).json({
            message: "Past bookings can't be modified",
            statusCode: 403
        });
    }

    // Check for Booking conflicts

    // find all bookings that match the spotId of the to-be-updated booking
    const bookings = await Booking.findAll({
        where: {spotId: booking.spotId}
    });

    for (let book of bookings) {

        //loop over the existing booking
        if (book.id != booking.id) {

            // format the existing booking dates
            let bookingStartDate = new Date(book.startDate.toISOString().slice(0, 10));
            let bookingEndDate = new Date(book.endDate.toISOString().slice(0, 10));

            // format existing booking dates as comparable values with .getTime()
            bookingStartDate = bookingStartDate.getTime();
            bookingEndDate = bookingEndDate.getTime();

            // Start date may not be between an existing booking
            if (startDate >= bookingStartDate && startDate <= bookingEndDate) {
                return res.status(403).json({
                    message: "Sorry, this spot is already booked for the specified dates",
                    statusCode: 403,
                    error: {
                        startDate: "Start date conflicts with an existing booking"
                    }
                });
            }
            // End date may not be between an existing booking
            if (endDate >= bookingStartDate && endDate <= bookingEndDate) {
                return res.status(403).json({
                    message: "Sorry, this spot is already booked for the specified dates",
                    statusCode: 403,
                    error: {
                        endDate: "End date conflicts with an existing booking"
                    }
                });
            }
            // Booking dates cannot encompass the existing dates
            if (startDate < bookingStartDate && endDate > bookingEndDate) {
                return res.status(403).json({
                    message: "Sorry, this spot is already booked for the specified dates",
                    statusCode: 403,
                    errors: {
                        startDate: "Start date conflicts with an existing booking",
                        endDate: "End date conflicts with an existing booking",
                    }
                });
            }
        }
    }

    //update the booking with the reqbody once all validations are passed
    booking.update(req.body);
    booking = booking.toJSON();

    //format newly updated booking start and end date as yyyy-mm-dd
    startDate = booking.startDate.toISOString().slice(0, 10);
    booking.startDate = startDate;
    endDate = booking.endDate.toISOString().slice(0, 10);
    booking.endDate = endDate;

    //format newly updated booking createdAt and updatedAt to yyyy-mm-dd hh:mm:ss
    const createdAtDate = booking.createdAt.toISOString().slice(0, 10);
    const createdAtTime = booking.createdAt.toISOString().slice(11, 19);
    booking.createdAt = `${createdAtDate} ${createdAtTime}`;
    const updatedAtDate = booking.updatedAt.toISOString().slice(0, 10);
    const updatedAtTime = booking.updatedAt.toISOString().slice(11, 19);
    booking.updatedAt = `${updatedAtDate} ${updatedAtTime}`;

    return res.status(200).json(booking);
});

// DELETE /api/bookings/:bookingId (Delete a booking)
router.delete('/:bookingId', requireAuth, async (req, res) => {

    const booking = await Booking.findByPk(req.params.bookingId);
    const currUser = req.user.id;

    //check if booking exists
    if (!booking) {
        return res.status(404).json({
            message: "Booking couldn't be found",
            statusCode: 404
        });
    }

    // Booking must belong to the current user or the Spot must belong to the current user
    const spot = await Spot.findByPk(booking.spotId);

    if (currUser != booking.userId && currUser != spot.ownerId) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403,
        });
    }

    //Bookings that have been started can't be deleted
    const startDate = booking.startDate.getTime();

    let todayDate = new Date();
    todayDate = todayDate.getTime();

    if (todayDate >= startDate) {
        return res.status(403).json({
            message: "Bookings that have been started can't be deleted",
            statusCode: 403
        });
    }

    //remove the booking
    booking.destroy();

    //send success msg response
    return res.json({
        message: "Successfully deleted",
        statusCode: 200
    });

});















module.exports = router;
