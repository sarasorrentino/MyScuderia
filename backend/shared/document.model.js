const mongoose = require('mongoose')

const DocumentSchema = new mongoose.Schema({
    _id: String,
    title: String,
    caption: String,
    doc: String,
    pub_date: Date
})

const Document = new mongoose.model("Document", DocumentSchema)

module.exports = {Document, DocumentSchema}
