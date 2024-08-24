const express = require('express')
const { v4: uuidv4 } = require('uuid');

const router = express.Router()

const Event = require('./models/Event')

/**
 * @swagger
 *   /events:
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

// Create an event with given number of seats
router.post('/events',async (req,res) =>{
   
    const { totalSeats } = req.body   

    if (!totalSeats || totalSeats < 10 || totalSeats > 1000) {
        return res.status(400).send('Total seats must be between 10 and 1000.');
      }
    
    const eventId = uuidv4();

    const seats = Array.from({ length: totalSeats }, (_, i) => ({ seatId: i + 1 }));
    // console.log(`seats: ${seats}`)
    const event = new Event({eventId,seats})

    try {
        await event.save()
        res.status(201).send({eventId})
    }
    catch(err){
        console.log(err.message)
        res.status(500).send("Error creating event")
    }


})

/**
 * @swagger
 *   /events/{eventId}/seats:
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

// Get number of seats per event
router.get('/events/:eventId/seats', async (req,res) => {
    const { eventId } = req.params

    try {
        const event = await Event.findOne({eventId})
        if(!event) return res.status(404).send("Event not found")

        const availableSeats = event.seats.filter(seat => seat.status === "Available")
        res.status(200).send(availableSeats)
    } catch(err) {
        res.status(500).send("Error fetching seats")
    }
})

/**
* @swagger
*   /events/{eventId}/seats/{seatId}/hold:
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

// Hold a seat in an event
router.post('/events/:eventId/seats/:seatId/hold', async (req,res) => {
    const { eventId,seatId } = req.params
    const userId = uuidv4()
    const holdTime = 60 * 2000
    console.log(seatId)

    try {
        const event = await Event.findOne({eventId})
        if(!event) return res.status(404).send("Event not found")       

        const seat = event.seats.find(s => s.seatId == seatId);

        if (!seat || seat.status !== 'Available') {
            return res.status(400).send('Seat not available');
          }               
        
        seat.status = "held"
        seat.userId = userId
        seat.holdUntil = new Date(Date.now() + holdTime)
        
        await event.save()

        setTimeout(async () => {
            const event = await Event.findOne({ eventId });
            console.log("Inside setTimeout")
            if(event){
                const seat = event.seats.filter(seat => seat.seatId == seatId)
                console.log(seat)
                if (seat && seat[0].status === 'held') {
                    console.log("Updating Available")
                    let filter = {"eventId":eventId,"seats.seatId":seatId}
                    let update_object = {
                        "seats.$[elem].status":"Available",
                        "seats.$[elem].userId":null,
                        "seats.$[elem].holdUntil":null
                    }
                    await Event.updateOne(filter,{$set:update_object},{arrayFilters: [{"elem.seatId":seatId}]})
                }
            }
        },holdTime)
        
        res.status(200).send({ message: 'Seat held', userId })
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Error holding seat")
    }

})

/**
* @swagger
*   /events/{eventId}/seats/{seatId}/reserve:
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


// Reserve an held seat
router.post('/events/:eventId/seats/:seatId/reserve', async (req,res) => {
    const { eventId, seatId } = req.params;
    const { userId } = req.body;
    

    try {
        const event = await Event.findOne({ eventId });
        if (!event) return res.status(404).send('Event not found');

        // const seat = event.seats.filter(seat => seat.seatId == seatId)

        const seat = event.seats.find(s => s.seatId == seatId);       
        
        if (!seat || seat.status != 'held' || seat.userId != userId) {
            return res.status(400).send('Seat not held by this user');
        }

        let filter = {"eventId":eventId,"seats.seatId":seatId}
        let update_object = {
            "seats.$[elem].status":"reserved",            
            "seats.$[elem].holdUntil":null
        }
        
        await Event.updateOne(filter,{$set:update_object},{arrayFilters: [{"elem.seatId":seatId}]})
        res.status(200).send('Seat reserved');
        
    }
    catch (err){
        console.log(err.message)
        res.status(500).send('Error reserving seat');
    }
})

/**
* @swagger
*   /events/{eventId}/seats/{seatId}/refresh:
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

// Endpoint to refresh a hold on a seat
router.post('/events/:eventId/seats/:seatId/refresh', async (req, res) => {
    const { eventId, seatId } = req.params;
    const { userId } = req.body;
    const holdTime = 60 * 1000; // 60 seconds
  
    try {
      const event = await Event.findOne({ eventId });
      if (!event) return res.status(404).send('Event not found');
  
      const seat = event.seats.find(s => s.seatId == seatId);
      if (!seat || seat.status !== 'held' || seat.userId !== userId) {
        return res.status(400).send('Seat not held by this user');
      }
  
      seat.holdUntil = new Date(Date.now() + holdTime);
      await event.save();
  
      res.status(200).send({ message: 'Hold refreshed', userId });
    } catch (err) {
      res.status(500).send('Error refreshing hold');
    }
  });

module.exports = router