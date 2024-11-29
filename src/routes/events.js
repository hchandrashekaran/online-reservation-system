const express = require('express')
const router = express.Router()
const events = require('../controllers/events.controller')
const verifyToken = require('../middleware/authMiddleware')


/**
 * @swagger
 *   /api/events:
 *     post:
 *       summary: Create an event with given number of seats
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       responses:
 *         201:
 *           description: New event created
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Event'
 */
// router.post("/",verifyToken,events.createEvent);
router.post("/",events.createEvent);

router.get("/",events.getAllEvents)

/**
 * @swagger
 *   /api/events/{eventId}/seats:
 *     get:
 *       summary: Get all seats of an event
 *       parameters:
 *         - in: path
 *           name: eventId
 *           schema:
 *             type: string
 *           required: true
 *           description: event id
 *       responses:
 *         200:
 *           description: Event seats
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Event'
 */
router.get("/:eventId/seats",events.getEventSeats);

module.exports = router;