const mongoose = require('mongoose')

const PhotoSchema = new mongoose.Schema({
    title: String,
    caption: String,
    image: String,
    pub_date: Date
})

const Photo = mongoose.model("Photo", PhotoSchema)

module.exports = {Photo, PhotoSchema}
