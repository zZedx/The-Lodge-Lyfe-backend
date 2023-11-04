const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const User = require('../models/users')
const catchAsyncError = require('../middleWares/catchAsyncError')
const isLoggedIn = require('../middleWares/isLoggedIn')

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    })
}

router.post('/register', catchAsyncError(async (req, res) => {
    try {
        const { email, password , name} = req.body
        const newUser = new User({ name , email, password })
        await newUser.save()
        const token = signToken(newUser._id)
        res.json({ token })
    }
    catch (e) {
        if (e.code === 11000) {
            throw new Error("Email already exists")
        }
        throw new Error(e.message)
    }
}))

router.post('/login', catchAsyncError(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw new Error("Please provide email and password")
    const user = await User.findOne({ email })

    if (!user || !await user.correctPassword(password, user.password)) {
        throw new Error("Incorrect Email or Password")
    }
    const token = signToken(user._id)
    res.json({ token })
}))

router.get('/allUsers', catchAsyncError(async (req, res) => {
    const role = req.query.users
    if (role === 'all') {
        const users = await User.find({})
        res.json(users)
    }
    else {
        const users = await User.find({ isAdmin : role === 'isAdmin' })
        res.json(users)
    }
}))

router.get('/getUser', isLoggedIn, catchAsyncError(async (req, res) => {
    res.json(req.user)
}))

module.exports = router