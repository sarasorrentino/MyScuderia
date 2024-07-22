let express = require("express");
const { Team } = require("../shared/team.model");
const { Gallery } = require("../shared/gallery.model");
const { Photo } = require("../shared/photo.model");
let router = express.Router();

router.get("/:teamId", async function (req, res) {
  const teamId = req.params.teamId;
  try {
    if (res.locals.team === teamId) {
      return res
        .status(200)
        .json(await Team.findById(teamId, "gallery").exec());
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (e) {
    return res.status(500).json(e);
  }
});

router.get("/:teamId/photo/:photoId", async function (req, res) {
  const teamId = req.params.teamId;
  const photoId = req.params.photoId;
  try {
    if (res.locals.team === teamId) {
      const team = await Team.findById(teamId, "gallery").exec();
      const gallery = team["gallery"];
      const photo = gallery["photos"];
      for(let i = 0; i < photo.length; i++){
        if(photo[i]._id == photoId){
          return res.status(200).json(photo[i]);
        }
      }
      return res.status(404).json({ error: "Not found" });
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

router.put("/:teamId/gallery", async function (req, res) {
  const teamId = req.params.teamId;
  try {
    if (res.locals.team === teamId && res.locals.role === process.env.ROLE_SM) {
      const team = await Team.findById(teamId, "gallery").exec();
      const gallery  = team["gallery"];
      gallery.title = req.body.title;
      gallery.caption = req.body.caption;
      gallery.lastEdit = Date.now();
      console.log(gallery);
      return res
        .status(201)
        .json(
          await Team.findByIdAndUpdate(teamId, { gallery: gallery }).exec()
        );
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

router.put("/:teamId/gallery/:photoId", async function (req, res) {
  const teamId = req.params.teamId;
  const photoId = req.params.photoId;
  try {
    if (res.locals.team === teamId && res.locals.role === process.env.ROLE_SM) {
      const team = await Team.findById(teamId, "gallery").exec();

      let newPhoto;
      newPhoto = new Photo({
        title: req.body.title,
        caption: req.body.caption,
        image: req.body.imageBase64,
        pub_date: Date.now(),
      });
      for (let i = 0; i < team["gallery"]["photos"].length; i++) {
        if (team["gallery"]["photos"][i]._id == photoId) {
          console.log("team[gallery][photos][i] "+ team["gallery"]["photos"][i] + " photoId " + photoId);
          team["gallery"]["photos"][i].title = req.body.title;
          team["gallery"]["photos"][i].captiom = req.body.caption;
          team["gallery"]["photos"][i].image = req.body.imageBase64;
          team["gallery"]["photos"][i].pub_date = Date.now();

          console.log("team[gallery][photos][i] "+ team["gallery"]["photos"][i] + " photoId " + photoId);
          await Team.findByIdAndUpdate(teamId, {gallery: team["gallery"]});
          await newPhoto.save();

          return res
              .status(200)
              .json(
                  await Photo.findByIdAndUpdate(photoId, newPhoto)
              )
        }
      }
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

router.post("/:teamId", async function (req, res) {
  const teamId = req.params.teamId;
  try {
    if (res.locals.team === teamId && res.locals.role === process.env.ROLE_SM) {
      let gallery;
      gallery = new Gallery({
        title: req.body.title,
        caption: req.body.caption,
        lastEdit: Date.now(),
      });
      return res
          .status(201)
          .json(
              await Team.findByIdAndUpdate(teamId, {gallery: gallery}).exec()
          );
    } else {
      return res.status(401).json({error: "Unauthorized"});
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

router.post("/:teamId/gallery", async function (req, res) {
  const teamId = req.params.teamId;
  try {
    if (res.locals.team === teamId && res.locals.role === process.env.ROLE_SM) {
      let photo;
      photo = new Photo({
        title: req.body.title,
        caption: req.body.caption,
        image: req.body.imageBase64,
        pub_date: Date.now(),
      });
      await photo.save();
      const team = await Team.findById(teamId, "gallery").exec();
      const gallery = team["gallery"];
      const photos = gallery["photos"];
      photos.push(photo);
      await Team.findByIdAndUpdate(teamId, {gallery: gallery}).exec()

      return res.status(201).json(gallery);
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

router.delete("/:teamId/gallery/:photoId", async function (req, res) {
  const teamId = req.params.teamId;
  const photoId = req.params.photoId;
  try {
    if (res.locals.team === teamId) {
      const team = await Team.findById(teamId, "gallery").exec();
      const gallery = team["gallery"];
      const photo = gallery["photos"];
      let updatedPhotos = [];
      for (let i = 0; i < photo.length; i++) {
        if (photo[i]._id != photoId) {
          updatedPhotos.push(photo[i]);
        }
      }
      console.log("up" + updatedPhotos);
      let newGallery = new Gallery;
      newGallery.photos = updatedPhotos;
      await Photo.findOneAndDelete(photoId).exec();
      return res
          .status(200)
          .json(
              await Team.findByIdAndUpdate(teamId, { gallery: newGallery }).exec()
          )
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

module.exports = router;
