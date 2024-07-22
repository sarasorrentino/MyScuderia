let express = require('express');
const {Calendar} = require("../shared/calendar.model");
const {Team} = require("../shared/team.model");
let router = express.Router();

router.get('/', async function (req, res) {
    try {
        return res.status(200).json(await Team.findById(res.locals.team,'calendar').exec())
    } catch (e) {
        return res.status(500).json(e.message)
    }
})
router.delete('/:calId', async function (req, res) {
    try {
        const calId = req.params.calId
        await Calendar.findByIdAndDelete(calId).exec()
        return res.status(200)
    } catch (e) {
        return res.status(500).json(e.message)
    }
})
router.post('/:calId', async function (req, res) {
    try {
        const { title, caption, date, duration, location } = req.body;
        const newEvent = new Calendar({
            title,
            caption,
            date,
            duration,
            location
        });
        const savedEvent = await newEvent.save();
        res.json(savedEvent);
    } catch (e) {
        return res.status(500).json(e.message)
    }
})

module.exports = router;
