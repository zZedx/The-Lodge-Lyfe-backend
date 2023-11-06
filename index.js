require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require('cookie-parser')

const cabinRoutes = require("./routes/cabins")
const settingsRoutes = require("./routes/settings")
const bookingsRoutes = require("./routes/bookings")
const usersRoutes = require("./routes/users");

mongoose
  .connect("mongodb://127.0.0.1:27017/WildOasis")
  .then(() => {
    console.log("Mongoose Running");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend's URL
  credentials: true,
}));
app.use(cookieParser());

app.get('/status' , (req, res) => {
  res.status(200).json({message: "OK"})
})

app.use("/cabins", cabinRoutes)
app.use('/settings', settingsRoutes)
app.use('/bookings', bookingsRoutes)
app.use('/users', usersRoutes)

app.use((err, req, res, next) => {
  const { status = 500 } = err
  if (!err.message) err.message = "Oh No, Something Went Wrong!"
  res.status(status).json({ err, message: err.message })
})

app.listen(3000, () => {
  console.log("Listening");
});
