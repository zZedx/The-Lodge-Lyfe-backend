const express = require('express')
const router = express.Router()

const catchAsyncError = require('../middleWares/catchAsyncError')
const Booking = require("../models/bookings")
const Guest = require('../models/guests')
const isAdmin = require('../middleWares/isAdmin')
const isLoggedIn = require('../middleWares/isLoggedIn')

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

router.get('/bookingsAfterDate', catchAsyncError(async (req, res) => {
  const { date } = req.query
  const bookingsAfterDate = await Booking.find({
    created_at: { $gte: date, $lte: new Date().toISOString() }
  })
    .populate("guest").populate({
      path: 'cabin',
      select: 'name'
    })
  res.json(bookingsAfterDate)
}))

router.get('/staysAfterDate', catchAsyncError(async (req, res) => {
  const { date } = req.query
  const staysAfterDate = await Booking.find({
    startDate: { $gte: date, $lte: new Date().toISOString() }
  })
    .populate("guest").populate({
      path: 'cabin',
      select: 'name'
    })
  res.json(staysAfterDate)
}))

router.get('/staysTodayActivity' , catchAsyncError(async (req , res) => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

  const staysToday = await Booking.find({
    startDate: { $gte: startOfDay, $lte: endOfDay }
  }).populate('guest');
  res.json(staysToday)
}))

router.get('/:bookingId', catchAsyncError(async (req, res) => {
  const { bookingId } = req.params
  const booking = await Booking.findById(bookingId).populate("guest").populate({
    path: 'cabin',
    select: 'name'
  })
  res.json(booking)
}))

router.use(isLoggedIn, isAdmin)

router.patch("/:bookingId", catchAsyncError(async (req, res) => {
  const { bookingId } = req.params
  await Booking.findByIdAndUpdate(bookingId, req.body)
  res.json()
}))

router.delete("/:bookingId", catchAsyncError(async (req, res) => {
  const { bookingId } = req.params
  await Booking.findByIdAndDelete(bookingId)
  res.json()
}))
module.exports = router

