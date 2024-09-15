const express = require("express")
const mongoose = require("mongoose")

const bodyPraser = require('body-parser')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const options = require('./swagger.js')

const Events = require('./src/routes/events.js')
const Reservations = require('./src/routes/reservations.js')

const app = express()
// app.use(express.json())

app.use(bodyPraser.json())

app.use("/api/events",Events)
app.use("/api/reservations",Reservations)

const specs = swaggerJsdoc(options)

app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(specs))

module.exports = app