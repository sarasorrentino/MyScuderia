let express = require('express');
const {Team} = require("../shared/team.model");
let router = express.Router();

router.get('/:teamId', async function (req, res) {
    try {
        res.status(200).json(await Team.findById(req.params.teamId, 'documents').exec())
    } catch (e) {
        return res.status(500).json(e.message)
    }
})

router.delete('/:teamId/:docId', async function (req, res) {
    try {
        const deletedDocument = await Document.findByIdAndDelete(req.params.id);
        res.json(deletedDocument);

    } catch (e) {
        return res.status(500).json(e.message)
    }
})

router.post('/:teamId', async function (req, res) {
    try {
        const { title, caption, doc, pub_date } = req.body;
        const newDocument = new Document({
            title,
            caption,
            doc,
            pub_date
        });
        const savedDocument = await newDocument.save();
        res.json(savedDocument);
    } catch (e) {
        return res.status(500).json(e.message)
    }
})

module.exports = router;
