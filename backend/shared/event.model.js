const mongoose = require('mongoose')
const User = require('./user.model')

const EventSchema = new mongoose.Schema({
    _id: String,
    title: String,
    caption: String,
    date: Date,
    duration: Number,
    location: String,
    participants: [User]
})

const Event = new mongoose.model("Event", EventSchema)

module.exports = {Event, EventSchema}
