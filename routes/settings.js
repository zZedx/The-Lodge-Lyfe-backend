const express = require('express')
const router = express.Router()

const Setting = require("../models/settings");
const catchAsyncError = require('../middleWares/catchAsyncError')

router.get('/', catchAsyncError(async (req, res) => {
    const settings = await Setting.findOne()
    res.json(settings)
}))

router.patch('/update', catchAsyncError(async (req, res) => {
    const { setting } = req.body
    await Setting.updateOne(setting)
    res.json()
}))

module.exports = router