const express = require('express')
const router = express.Router()
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({storage});
const {cloudinary} = require('../cloudinary')

const catchAsyncError = require('../middleWares/catchAsyncError')
const Cabin = require("../models/cabins");

router.get("/", catchAsyncError(async (req, res) => {
  const allCabins = await Cabin.find();
  res.json(allCabins);
}));

router.post("/create", upload.single("image"), catchAsyncError(async (req, res) => {
  const { name, maxCapacity, discount, description, regularPrice } = req.body;
  const image = req.file ? req.file.path : req.body.image;
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

router.delete('/delete', catchAsyncError(async (req, res) => {
  const { id } = req.body
  const cabin = await Cabin.findById(id)
  const copyCabins = await Cabin.find({ imageName: cabin.imageName })
  if (copyCabins.length <= 1) {
    await cloudinary.uploader.destroy(cabin.imageName)
  }
  await Cabin.findByIdAndDelete(id)
  res.json()
}))

router.put('/edit', upload.single("image"), catchAsyncError(async (req, res) => {
  const { _id } = req.body
  if (req.file) {
    await Cabin.findOneAndUpdate({ _id }, { ...req.body, image: req.file.path, imageName: req.file.filename })
    await cloudinary.uploader.destroy(req.body.imageName)
  } else {
    await Cabin.findByIdAndUpdate(_id, req.body)
  }
  res.json()
}))

module.exports = router