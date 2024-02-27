const mongoose = require("mongoose")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
const {Schema, model} = mongoose

const userSchema = new Schema({
    fullname:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        reqquired:true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    confirmedPassword:{
        type:String,
        required:true
    },
    resetToken: String,
    resetExpires: Date
})

userSchema.plugin(passportLocalMongoose)

const Usermodel = model("User", userSchema)

passport.use(Usermodel.createStrategy())

passport.serializeUser(Usermodel.serializeUser())

passport.deserializeUser(Usermodel.deserializeUser())

module.exports = Usermodel