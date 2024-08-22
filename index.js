const express = require("express")
const mongoose = require("mongoose")
const Event = require('./models/Event.js')
const apiRoute = require('./router.js')
const bodyPraser = require('body-parser')

const app = express()
// app.use(express.json())

const port = 3005
const mongoUri = "mongodb://localhost:27017/eventReservation"

app.use(bodyPraser.json())

app.use('/',apiRoute)

app.listen(port,async () => {
    try{
        await mongoose.connect(mongoUri)
    }
    catch(err){
        console.log(err.message)
    }
    console.log(`Server listening on port: ${port}`)
})