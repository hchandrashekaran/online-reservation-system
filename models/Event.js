const mongoose = require("mongoose")

const eventSchema = mongoose.Schema({
    eventId: {type: String,require:true,unique:true},
    seats: [
        {
            seatId: {type:Number,required:true},
            status: {type:String,default:"Available"},
            userId: {type:String},
            holdUntil: {type:Date}
        }
    ]

})

module.exports = mongoose.model('Event',eventSchema)