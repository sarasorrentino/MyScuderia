const mongoose = require('mongoose')
const Docs = require('./document.model')
const docSchema = Docs.DocumentSchema

const BoardSchema = new mongoose.Schema({
    title: String,
    caption: String,
    lastEdit: Date,
    docs: [docSchema]
})

const Board = mongoose.model('Board', BoardSchema)

module.exports = {Board, BoardSchema}
