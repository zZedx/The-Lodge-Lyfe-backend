const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Booking = require('./bookings')

const cabinSchema = new Schema({
    name:{
        type:String,
    },
    maxCapacity : {
        type:Number,
    },
    discount : {
        type:Number,
    },
    description:{
        type:String,
    },
    regularPrice:{
        type:Number,
    },
    image:{
        type:String,
    },
    imageName : {
        type : String
    }
})

cabinSchema.post('findByIdAndDelete', async function(doc,next){
    try{
        await Booking.deleteMany({cabinId:doc._id})
        next()
    }catch(err){
        next(err)
    }
})

const Cabin = mongoose.model('Cabin',cabinSchema)

module.exports = Cabin