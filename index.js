require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const { storage } = require("./cloudinary");
const upload = multer({storage});

const Booking = require("./models/bookings");
const Cabin = require("./models/cabins");
const Guest = require("./models/guests");
const Setting = require("./models/settings");

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

app.get("/cabins", async (req, res) => {
  const allCabins = await Cabin.find();
  res.json(allCabins);
});

app.post("/createCabin", upload.single("image"), async (req, res) => {
  const { name, maxCapacity, discount, description, regularPrice } = req.body;
  const  image  = req.file.path;
  const newCabin = new Cabin({
    name,
    maxCapacity,
    description,
    discount,
    regularPrice,
    image
  });
  newCabin.save()
  res.json();
});

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
