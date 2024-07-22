var mongoose = require('mongoose');

const ComponentSchema = new mongoose.Schema({
    name: String,
    description: String,
    n_available: Number,
    depId: String
})

const Component = mongoose.model("Component", ComponentSchema);

module.exports = {Component, ComponentSchema}
