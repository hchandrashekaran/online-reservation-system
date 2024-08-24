const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Online event reservation system",
            version: "1.0.0",
            description: "The Online Reservation System is designed to manage event seat reservations. It includes services for creating events, listing available seats, holding seats for a limited time, and reserving seats."
        },
        servers: [{
            url: "http://localhost:3005"
        }],
        components: {
            schemas: {
                Event: {
                    type: 'object',
                    required: ['totalSeats', 'eventId', 'seatId', 'userId'],
                    properties: {
                        totalSeats: {
                            type: 'integer',
                            description: 'Total number of seats per event'
                        },
                        eventId: {
                            type: 'string',
                            description: 'unique event Id'
                        },
                        seatId: {
                            type: 'ineteger',
                            description: 'unique seat Id'
                        },
                        userId: {
                            type: 'string',
                            description: 'unique user Id'
                        },

                    }
                }
            }
        }


    },
    apis: ["./router.js"]
}

module.exports = options