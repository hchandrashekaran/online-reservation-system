const mongoose = require("mongoose")
const app = require("./server");
require('dotenv').config()

const port = process.env.PORT
const mongoUri = process.env.MONGO_LOCAL
// const mongoUri = process.env.MONGO_DOCKER // Change mongo_uri for docker and rebuild the docker "docker-compose up --build"


app.listen(port,async () => {
    try{
        const database = await mongoose.connect(mongoUri)
                            .then(() => {
                                console.log("Database connected")
                            })
    }
    catch(err){
        console.log(err.message)
    }
    console.log(`Server listening on http://localhost: ${port}`)
    console.log(`Swagger docs are available at http://localhost:${port}/api-docs`)
})