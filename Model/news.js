const mongoose = require("mongoose")
const {Schema, model} = mongoose

const newsSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    }
})

const newsModel = mongoose.model("news", newsSchema)
module.exports = newsModel