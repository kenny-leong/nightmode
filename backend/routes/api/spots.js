//Setup router
const express = require('express')

const router = express.Router();

const { Spot, Review, SpotImage, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');


//GET /api/spots (Get all spots)
