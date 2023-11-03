const express = require('express')
const router = express.Router()

const Setting = require("../models/settings");
const catchAsyncError = require('../middleWares/catchAsyncError');
const isLoggedIn = require('../middleWares/isLoggedIn');
const isAdmin = require('../middleWares/isAdmin');

router.get('/', catchAsyncError(async (req, res) => {
    const settings = await Setting.findOne()
    res.json(settings)
}))

router.use(isLoggedIn , isAdmin)

router.patch('/update', catchAsyncError(async (req, res) => {
    const { setting } = req.body
    await Setting.updateOne(setting)
    res.json()
}))

module.exports = router