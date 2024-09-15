const { v4: uuidv4 } = require('uuid');

const Event = require('../models/Event')

// Hold seats of an event upto a given time
const holdSeat = async (req,res) => {
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
}

// Reserve the held seat
const reserveSeat = async (req,res) => {
    const { eventId, seatId } = req.params;
    const { userId } = req.body;
    

    try {
        const event = await Event.findOne({ eventId });

        if (!event) return res.status(404).send('Event not found');        

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
}

// Refresh hold time
const refreshSeat = async (req,res) => {
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
}

module.exports = {
    holdSeat,
    reserveSeat,
    refreshSeat
}