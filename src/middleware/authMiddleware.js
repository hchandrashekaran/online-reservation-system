const jwt = require('jsonwebtoken')
require('dotenv').config()

const secretKey = process.env.SECRET_KEY

const verifyToken = (req,res,next) => {
    // const token = req.header('Authorization')
    const token = req.headers.authorization.split(' ')[1]
    console.log(`token: ${token}`)

    if(!token){
        return res.status(401).json({error: 'Access denied'})
    }

    try{
        const decoded = jwt.verify(token,secretKey)
        // req.userId = decoded.userId
        next()
    } catch (error){
        res.status(401).json({ error: 'Invalid token' });
    }
}

module.exports = verifyToken