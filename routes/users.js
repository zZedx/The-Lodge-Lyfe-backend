const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const User = require('../models/users')
const catchAsyncError = require('../middleWares/catchAsyncError')

router.post('/signup', catchAsyncError(async (req, res) => {
    const { email, password } = req.body
        const newUser = new User({ name : "very good" , email, password })
        await newUser.save()
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRY
        })
        res.json({ token })
}))

router.post('/login', catchAsyncError(async (req, res) => {
    console.log(req.body)
    res.json()
}))

module.exports = router