const mongoose = require('mongoose')
const {ComponentSchema} = require('./component.model')

const DepartmentSchema = new mongoose.Schema({
    name: String,
    caption: String,
    manager: String,
    components: [ComponentSchema]
})

const Department = mongoose.model("Department", DepartmentSchema);

module.exports = {Department, DepartmentSchema};
