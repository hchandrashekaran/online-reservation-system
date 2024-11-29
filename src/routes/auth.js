const express = require('express')
const router = express.Router()
const User = require('../models/User')
const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

const secretKey = process.env.SECRET_KEY

router.post('/register', async (req,res) => {
    try {
        const { username,password} = req.body
        const hashedPassword = await bcrypt.hash(password,10)
        const user = new User({username,password:hashedPassword})
        await user.save()
        res.status(201).send('User created')
    }
    catch ( error ) {
       res.status(500).send('Registration failed')
    }   

})

router.post('/login', async (req,res) => {
    try{
        const { username,password } = req.body
        const user = User.findOne({username})

        if(!user) {
            res.status(401).json({error: 'user not found'})
        }

        const passwordMatch = bcrypt.compare(password,user.password)
        if(!passwordMatch) {
            res.status(401).json({error: 'Authentication failed'})
        }

        const token = JWT.sign({userId:user._id},secretKey,{
            expiresIn: '1h'
        })
        res.status(200).json({token})

    } catch(error) {
        res.status(500).json({ error: 'Login failed' })
    }
})

module.exports = router