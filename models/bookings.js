const mongoose = require("mongoose")
const Schema = mongoose.Schema

const bookingSchema = new Schema({
    created_at : {
        type : Date,
        default : Date.now,
    },
    startDate : {
        type : Date,
    },
    endDate : {
        type : Date,
    },
    numNights : {
        type : Number,
    },
    numGuests : {
        type : Number,
    },
    cabinPrice : {
        type : Number,
    },
    extrasPrice : {
        type : Number,
    },
    totalPrice : {
        type : Number,
    },
    status : {
        type : String,
    },
    hasBreakfast : {
        type : Boolean,
    },
    isPaid : {
        type : Boolean,
    },
    observations : {
        type : String,
    },
    guest : {
        type : Schema.Types.ObjectId,
        ref : 'Guest',
    },
    cabin : {
        type : Schema.Types.ObjectId,
        ref : 'Cabin',
    },
})

const Booking = mongoose.model('Booking',bookingSchema)
module.exports = Booking