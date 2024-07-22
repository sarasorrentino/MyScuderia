const mongoose = require("mongoose");
const {BoardSchema} = require('./board.model')
const {GallerySchema} = require('./gallery.model')
const {CalendarSchema} = require('./calendar.model')
const {RecordSchema} = require('./record.model')
const {DepartmentSchema} = require('./department.model')

const TeamSchema = new mongoose.Schema({
    userId: [],
    name: String,
    board: BoardSchema,
    gallery: GallerySchema,
    calendar: CalendarSchema,
    history: [RecordSchema],
    departments: [DepartmentSchema]
});

const Team = mongoose.model("Team", TeamSchema);

module.exports = {Team, TeamSchema}
