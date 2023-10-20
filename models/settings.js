const mongoose = require("mongoose")
const Schema = mongoose.Schema

const settingSchema = new Schema({
    minBookingLength : {
        type : Number,
    },
    maxBookingLength : {
        type : Number,
    },
    maxGuestsPerBooking : {
        type : Number,
    },
    breakfastPrice : {
        type : Number,
    },
})

const Setting = mongoose.model('Setting',settingSchema)
module.exports = Setting
    