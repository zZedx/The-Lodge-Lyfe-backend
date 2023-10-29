const express = require('express')
const router = express.Router()

const catchAsyncError = require('../middleWares/catchAsyncError')
const Booking = require("../models/bookings")
const Guest = require('../models/guests')

router.get('/' , catchAsyncError(async(req,res)=>{
    const  allBookings = await Booking.find().populate({
        path: 'guest',
        select: 'fullName email'
      }).populate({
        path: 'cabin',
        select: 'name'
      })
    res.json(allBookings)
}))

module.exports = router

