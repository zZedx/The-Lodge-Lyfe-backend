require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const cabinRoutes = require("./routes/cabins")
const settingsRoutes = require("./routes/settings")

mongoose
  .connect("mongodb://127.0.0.1:27017/WildOasis")
  .then(() => {
    console.log("Mongoose Running");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());
app.use(cors());

app.use("/cabins" , cabinRoutes)
app.use('/settings' , settingsRoutes)

app.use((err, req, res, next) => {
    const { status = 500 } = err
    if (!err.message) err.message = "Oh No, Something Went Wrong!"
    res.status(status).json({err})
})

app.listen(3000, () => {
  console.log("Listening");
});
