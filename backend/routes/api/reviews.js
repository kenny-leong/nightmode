//Feature 2: Set up the router
const express = require('express');

const router = express.Router();

const { Spot, Review, ReviewImage, User, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

// GET /api/reviews/current: Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {
    const currUser = req.user.id;

    let reviews = await Review.findAll({
        where: { userId: currUser }
    });


});

//export the router for use in ./api/index.js
module.exports = router;
