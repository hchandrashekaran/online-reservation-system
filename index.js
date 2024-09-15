const mongoose = require("mongoose")
const app = require("./server");
require('dotenv').config()

const port = process.env.PORT
const mongoUri = process.env.MONGO_LOCAL
// const mongoUri = process.env.MONGO_DOCKER // Change mongo_uri for docker and rebuild the docker "docker-compose up --build"


app.listen(port,async () => {
    try{
        await mongoose.connect(mongoUri)
    }
    catch(err){
        console.log(err.message)
    }
    console.log(`Server listening on port: ${port}`)
})