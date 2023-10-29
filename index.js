require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const { storage } = require("./cloudinary");
const upload = multer({storage});
const {cloudinary} = require('./cloudinary')

const Booking = require("./models/bookings");
const Cabin = require("./models/cabins");
const Guest = require("./models/guests");
const Setting = require("./models/settings");

const catchAsyncError = require('./middleWares/catchAsyncError')

mongoose
  .connect("mongodb://127.0.0.1:27017/WildOasis")
  .then(() => {
    console.log("Mongoose Running");
  })
  .catch((e) => {
    console.log(e);
  });

const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.json());
app.use(cors());
// app.use(express.urlencoded({ extended: false }));

app.get("/cabins", catchAsyncError(async (req, res) => {
  const allCabins = await Cabin.find();
  res.json(allCabins);
}));

app.post("/createCabin", upload.single("image"), catchAsyncError(async (req, res) => {
  const { name, maxCapacity, discount, description, regularPrice } = req.body;
  const  image  = req.file ? req.file.path : req.body.image;
  const imageName = req.file ? req.file.filename : req.body.imageName
  const newCabin = new Cabin({
    name,
    maxCapacity,
    description,
    discount,
    regularPrice,
    image,
    imageName
  });
  newCabin.save()
  res.json();
}));

app.delete('/deleteCabin' , catchAsyncError(async(req,res)=>{
    const {id} = req.body
    const cabin = await Cabin.findById(id)
    const copyCabins = await Cabin.find({imageName : cabin.imageName})
    if(copyCabins.length <= 1){
      await cloudinary.uploader.destroy(cabin.imageName)
    }
    await Cabin.findByIdAndDelete(id)
    res.json()
}))

app.put('/editCabin',upload.single("image"), catchAsyncError(async(req,res)=>{
  const {_id} = req.body
  if(req.file){
    await Cabin.findOneAndUpdate( {_id} , {...req.body , image : req.file.path , imageName : req.file.filename})
    await cloudinary.uploader.destroy(req.body.imageName)
  }else{
    await Cabin.findByIdAndUpdate( _id , req.body)
  }
  res.json()
}))

app.get('/settings' , catchAsyncError(async(req,res)=>{
  const settings = await Setting.findOne()
  res.json(settings)
}))

app.patch('/updateSettings' , catchAsyncError(async(req,res)=>{
  const {setting} = req.body
  await Setting.updateOne(setting)
  res.json()
}))

app.use((err, req, res, next) => {
    const { status = 500 } = err
    if (!err.message) err.message = "Oh No, Something Went Wrong!"
    res.status(status).json({err})
})

app.listen(3000, () => {
  console.log("Listening");
});

// const guest = new Guest({
//     fullName : 'John Doe',
//     email : 'text@gmail.com',
// })
// guest.save()
// const cabin = new Cabin({
//     name : '001',
//     maxCapacity : 2,
//     discount : 50,
//     description : 'This is a cabin',
//     regularPrice : 250,
//     image : 'https://i.imgur.com/2nCt3Sbl.jpg',
// })
// cabin.save()
// const booking = new Booking({
//     startDate : new Date(),
//     endDate : new Date(),
//     numberNights : 3,
//     numberGuests : 2,
//     cabinPrice : 250,
//     extrasPrice : 0,
//     totalPrice : 250,
//     status : 'pending',
//     hasBreakfast : false,
//     isPaid : false,
//     observations : 'This is a booking'
// })
// booking.guest = guest
// booking.cabin = cabin
// booking.save()
