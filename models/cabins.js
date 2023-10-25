const mongoose = require("mongoose")
const Schema = mongoose.Schema

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

const Cabin = mongoose.model('Cabin',cabinSchema)
module.exports = Cabin