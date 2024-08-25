const { v4: uuidv4 } = require('uuid');

const Event = require('../models/Event')

// Create event with given number of seats
// Each event will be indentified with UUID
const createEvent = async (req,res) => {
    const { totalSeats } = req.body   

    if (!totalSeats || totalSeats < 10 || totalSeats > 1000) {
        return res.status(400).send('Total seats must be between 10 and 1000.');
      }
    
    const eventId = uuidv4();

    const seats = Array.from({ length: totalSeats }, (_, i) => ({ seatId: i + 1 }));
    
    const event = new Event({eventId,seats})

    try {
        await event.save()
        res.status(201).send({eventId})
    }
    catch(err){
        console.log(err.message)
        res.status(500).send("Error creating event")
    }

}

// Get all seats of an Evenet
const getEventSeats = async (req,res) => {
    const { eventId } = req.params

    try {
        const event = await Event.findOne({eventId})
        if(!event) return res.status(404).send("Event not found")

        const availableSeats = event.seats.filter(seat => seat.status === "Available")
        res.status(200).send(availableSeats)
    } catch(err) {
        res.status(500).send("Error fetching seats")
    }
}

module.exports = {
    createEvent,
    getEventSeats
}