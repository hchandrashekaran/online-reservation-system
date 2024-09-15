const express = require('express')
const router = express.Router()
const reservations = require('../controllers/reservations.controller')

/**
* @swagger
*   /api/reservations/{eventId}/seats/{seatId}/hold:
*     post:
*       summary: Hold a seat in an event
*       parameters:
*         - in: path
*           name: eventId
*           schema:
*             type: string
*           required: true
*           description: event id
*         - in: path
*           name: seatId
*           schema:
*             type: integer
*           required: true
*           description: seat id
*       responses:
*         200:
*           description: Event seats
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/Event'
*/
router.post("/:eventId/seats/:seatId/hold",reservations.holdSeat);

/**
* @swagger
*   /api/reservations/{eventId}/seats/{seatId}/reserve:
*     post:
*       summary: Reserve an held seat of a event
*       parameters:
*         - in: path
*           name: eventId
*           schema:
*             type: string
*           required: true
*           description: event id
*         - in: path
*           name: seatId
*           schema:
*             type: integer
*           required: true
*           description: seat id
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Event'
*       responses:
*         200:
*           description: Event seats
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/Event'
*/
router.post("/:eventId/seats/:seatId/reserve",reservations.reserveSeat);

/**
* @swagger
*   /api/reservations/{eventId}/seats/{seatId}/refresh:
*     post:
*       summary: Refresh the hold time of a seat in an event
*       parameters:
*         - in: path
*           name: eventId
*           schema:
*             type: string
*           required: true
*           description: event id
*         - in: path
*           name: seatId
*           schema:
*             type: integer
*           required: true
*           description: seat id
*       responses:
*         200:
*           description: Event seats
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/Event'
*/
router.post("/:eventId/seats/:seatId/refresh",reservations.refreshSeat);

module.exports = router