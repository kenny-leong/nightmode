// Setup SpotImages router
const express = require('express')

const router = express.Router();

const { Spot, Review, ReviewImage, Booking, SpotImage, User, sequelize } = require('../../db/models');
const user = require('../../db/models/user');
const { requireAuth } = require('../../utils/auth');


// DELETE /api/spot-images/:imageId (Delete a Spot Image)
router.delete('/:imageId', requireAuth, async (req, res) => {
    const currUser = req.user.id;
    const spotImage = await SpotImage.findByPk(req.params.imageId);

    //Check if spot image exists
    if (!spotImage) {
        return res.status(404).json({
            message: "Spot Image couldn't be found",
            statusCode: 404
        });
    }

    //Spot must belong to the current user
    const spot = await Spot.findByPk(spotImage.spotId);

    if (currUser != spot.ownerId) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        });
    }

    // remove the spotImage
    spotImage.destroy();

    res.status(200).json({
        message: "Successfully deleted",
        statusCode: 200
    });

});



module.exports = router;
