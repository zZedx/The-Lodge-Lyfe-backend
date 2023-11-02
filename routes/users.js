const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const User = require('../models/users')
const catchAsyncError = require('../middleWares/catchAsyncError')

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    })
}

router.post('/signup', catchAsyncError(async (req, res) => {
    const { email, password } = req.body
    const newUser = new User({ name: "very good", email, password })
    await newUser.save()
    const token = signToken(newUser._id)
    res.json({ token  , email : newUser.email , password : newUser.password})
}))

router.post('/login', catchAsyncError(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw new Error("Please provide email and password")
    const user = await User.findOne({ email })

    if (!user || !await user.correctPassword(password, user.password)) {
        throw new Error("Incorrect Email or Password")
    }
    const token = signToken(user._id)
    res.json({token , email : user.email , password : user.password})
}))

module.exports = router