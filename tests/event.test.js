const app = require('../server')
const mongoose = require('mongoose')
const request = require('supertest')
const Event = require('../src/models/Event')
const { v4: uuidv4 } = require('uuid');

// beforeEach(async () => {
//     await mongoose.connect("mongodb://localhost:27017/eventReservation");
//   });

// afterEach(async () => {
//     await mongoose.connection.close()
// })


describe('Event API tests',() => {

    it('Should create an event successfully', async () => {
        const res = await request(app)
            .post('/api/events')
            .send({totalSeats:28})

        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty('eventId')

    })

    it('Should get all the seats of an event', async () => {
        const event = new Event({
            eventId: uuidv4(),
            totalSeats: 2,
            seats: [{ seatId: 1, status: 'Available' }, { seatId: 2, status: 'Available' }]
        })

        await event.save()     

        const res = await request(app).get(`/api/events/${event.eventId}/seats/`);

        expect(res.statusCode).toEqual(200)
        expect(res.body.length).toEqual(2)
    })
})