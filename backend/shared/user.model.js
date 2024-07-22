const mongoose = require("mongoose");
const {TeamSchema} = require('./team.model')

const UserSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true,
    },
    role: String,
});


const TeamPrincipalSchema = new mongoose.Schema({
    ...UserSchema.obj,
    team: TeamSchema
})
const MediaManagerSchema = new mongoose.Schema({
    ...UserSchema.obj,

})
const DriverSchema = new mongoose.Schema({
    ...UserSchema.obj,
    driver_num: Number,
    license_points: Number,
    isRacing: Boolean,
})
const EngineerSchema = new mongoose.Schema({
    ...UserSchema.obj,
    isHeadOfDepartment: Boolean,
    department: String
})

const User = mongoose.model("User", UserSchema)
const TeamPrincipal = mongoose.model("TeamPrincipal", TeamPrincipalSchema)
const MediaManager = mongoose.model("MediaManager", MediaManagerSchema)
const Driver = mongoose.model("Driver", DriverSchema)
const Engineer = mongoose.model("Engineer", EngineerSchema)

module.exports = {User, TeamPrincipal, MediaManager, Driver, Engineer}
