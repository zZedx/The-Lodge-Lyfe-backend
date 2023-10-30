const mongoose = require("mongoose")
const Schema = mongoose.Schema

const guestSchema = new Schema({
    fullName : {
        type : String,
    },
    email : {
        type : String,
    },
    nationalID : {
        type : String,
    },
    nationality : {
        type : String,
    },
    countryFlag : {
        type : String,
    },
})

const Guest = mongoose.model('Guest',guestSchema)
module.exports = Guest