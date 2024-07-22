const mongoose = require('mongoose')
const {EventSchema} = require('./event.model')

const CalendarSchema = mongoose.Schema({
    title: String,
    caption: String,
    lastEdit: Date,
    events: [EventSchema]
})

const Calendar = mongoose.model("Calendar", CalendarSchema)

module.exports = {Calendar, CalendarSchema}
