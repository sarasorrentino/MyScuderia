const mongoose = require('mongoose')
const {PhotoSchema} = require('./photo.model')

const GallerySchema = new mongoose.Schema({
    title: String,
    caption: String,
    lastEdit: Date,
    photos: [PhotoSchema]
})

const Gallery = mongoose.model('Gallery', GallerySchema)

module.exports = {Gallery, GallerySchema}
