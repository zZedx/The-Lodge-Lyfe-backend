const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require("bcryptjs")

const userSchema = new Schema({
    name: {
        type: String,
        unique: false
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type : String,
        // select: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    profilePic: {
        type: String,
        default: 'https://res.cloudinary.com/dbm00ix5k/image/upload/v1698905214/default_pfp.jpg'
    },
    imageName :{
        type: String,
        default: 'default_pfp'
    },
})

userSchema.pre('save', async function(next){
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12)
    next()
})
userSchema.pre('findOneAndUpdate', async function(next){
    const docToUpdate = this.getUpdate();
    if(!docToUpdate.password) return next()
    docToUpdate.password = await bcrypt.hash(docToUpdate.password, 12)
    next()
})

userSchema.methods.correctPassword = async function(candidatePassword , userPassword){
    return await bcrypt.compare(candidatePassword , userPassword)
}

module.exports = mongoose.model('User', userSchema)
