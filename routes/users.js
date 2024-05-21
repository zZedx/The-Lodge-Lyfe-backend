const isProduction = process.env.NODE_ENV === "production";

const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const { cloudinary } = require('../cloudinary')

const User = require('../models/users')
const catchAsyncError = require('../middleWares/catchAsyncError')
const isLoggedIn = require('../middleWares/isLoggedIn')
const isAdmin = require('../middleWares/isAdmin')


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    })
}

const clearCookieAsync = async (res) => {
    return new Promise((resolve, reject) => {
      res.clearCookie("token", {
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
      });
      resolve();
    });
  };

router.post('/register', catchAsyncError(async (req, res) => {
    try {
        const { email, password, name } = req.body
        const newUser = new User({ name, email, password })
        await newUser.save()
        const token = signToken(newUser._id)
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
          });
        res.json({ message: "Registered"})
    }
    catch (e) {
        if (e.code === 11000) {
            throw new Error("Email already exists")
        }
        throw new Error(e.message)
    }
}))

router.post('/login', catchAsyncError(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw new Error("Please provide email and password")
    const user = await User.findOne({ email })

    if (!user || !await user.correctPassword(password, user.password)) {
        throw new Error("Incorrect Email or Password")
    }
    const token = signToken(user._id)
    res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
    res.json({ message: "Logged in"})
}))

router.post('/logout', catchAsyncError(async (req, res) => {
    await clearCookieAsync(res);
    res.json({ message: "Logged out" });
}))

router.get('/allUsers', catchAsyncError(async (req, res) => {
    const role = req.query.users
    if (role === 'all') {
        const users = await User.find({})
        res.json(users)
    }
    else {
        const users = await User.find({ isAdmin: role === 'isAdmin' })
        res.json(users)
    }
}))

router.get('/getUser', isLoggedIn, catchAsyncError(async (req, res) => {
    res.json(req.user)
}))

const isTestUser = (req, res, next) => {
    if (req.user.email === 'test@gmail.com') {
        throw new Error("You can't edit the test user. Please create your own account")
    }
    next()
}

router.patch('/updateUser', isLoggedIn,isTestUser, upload.single("profilePic"), catchAsyncError(async (req, res) => {
    const { name, oldPassword, password, imageName } = req.body;
    const updateData = { name };

    const user = await User.findById(req.user._id);
    if (oldPassword && !await user.correctPassword(oldPassword, user.password)) {
        throw new Error("The password did not match our records");
    }
    else if (password){
        updateData.password = password;
    }
    if (req.file) {
        if (user.imageName !== 'default_pfp') {
            await cloudinary.uploader.destroy(user.imageName);
        }
        updateData.profilePic = req.file.path;
        updateData.imageName = req.file.filename;
    }
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData , {new: true});
    res.json(updatedUser);
}))

router.use(isLoggedIn, isAdmin)

router.delete('/deleteUser/:id', catchAsyncError(async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id)
    if (!user) throw new Error("User not found")
    if (user.imageName !== 'default_pfp') {
        await cloudinary.uploader.destroy(user.imageName);
    }
    await User.findByIdAndDelete(id)
    res.json()
}))

router.patch('/updateRole/:id', catchAsyncError(async (req, res) => {
    const { id } = req.params
    const { isAdmin } = req.body
    await User.findByIdAndUpdate(id, { isAdmin })
    res.json()
}))

module.exports = router