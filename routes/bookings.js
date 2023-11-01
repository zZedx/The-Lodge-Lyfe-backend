const express = require('express')
const router = express.Router()

const catchAsyncError = require('../middleWares/catchAsyncError')
const Booking = require("../models/bookings")
const Guest = require('../models/guests')

router.get('/', catchAsyncError(async (req, res) => {
  const { status } = req.query
  if (status === "all") {
    const allBookings = await Booking.find().populate({
      path: 'guest',
      select: 'fullName email'
    }).populate({
      path: 'cabin',
      select: 'name'
    })
    res.json(allBookings)
  } else {
    const filteredBookings = await Booking.find({ status }).populate({
      path: 'guest',
      select: 'fullName email'
    }).populate({
      path: 'cabin',
      select: 'name'
    })
    res.json(filteredBookings)
  }
}))

router.get('/:bookingId', catchAsyncError(async (req, res) => {
  const { bookingId } = req.params
  const booking = await Booking.findById(bookingId).populate("guest").populate({
    path: 'cabin',
    select: 'name'
  })
  res.json(booking)
}))

router.patch("/:bookingId", catchAsyncError(async (req, res) => {
  const { bookingId } = req.params
  await Booking.findByIdAndUpdate(bookingId, { status: "checked-in", isPaid: true, ...req.body })
  res.json()
}))

module.exports = router

