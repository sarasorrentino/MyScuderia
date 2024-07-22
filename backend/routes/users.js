let express = require("express");
let router = express.Router();
const {User} = require("../shared/user.model");
const {TeamPrincipal, MediaManager, Driver, Engineer} = require("../shared/user.model");
const {Team} = require("../shared/team.model");
const {Board} = require("../shared/board.model");
const {Gallery} = require("../shared/gallery.model");
const {Calendar} = require("../shared/calendar.model");

router.get("/:userId", async function (req, res) {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId).exec();
    if(user == null)
      return res.status(401).send("User does not exists");
    else{
      switch (String(user.role)){
        case "pilot":
          return res.status(200).send(await Driver.findById(userId).exec());
        case "social_media_manager":
          return res.status(200).send(await MediaManager.findById(userId).exec());
        case "engineer":
          return res.status(200).send(await Engineer.findById(userId).exec());
        case "team_principal":
          return res.status(200).send(await TeamPrincipal.findById(userId).exec());
        default:
          return res.status(200).send({error: "Unexisting role"});
      }
    }
  } catch (e) {
    res.status(500).json(e);
  }
});

router.get("/:userId/role", async function (req, res) {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId).exec();
    console.log(user);
    return res.status(200).send(await User.findById({_id: userId}, "role").exec());
  } catch (e) {
    res.status(500).json(e);
  }
});

router.put("/:userId", async function (req, res) {
  const userId = req.params.userId;

  try {
    if (userId !== res.locals.uid && res.locals.role === process.env.ROLE_TP) {
      const user = await User.findById(userId).exec();
      if(user == null)
        return res.status(404).send("User does not exists");
      console.log(String(user.role));

      if(String(user.role) != (String)(req.body.role)) return res.status(401).send("Cannot change role");
      switch (String(user.role)){
        case "pilot":
          return res.status(201).json(await Driver.findByIdAndUpdate(userId,
              {
                driver_num: req.body.driver_num,
                license_points: req.body.license_points,
                isRacing: req.body.isRacing
              }
          ).exec())
        case "social_media_manager":
          return res.status(401).send("Cannot modify Social Media Manager");
        case "team_principal":
          return res.status(401).send("Cannot modify Team Principal");
        case "engineer":
          return res.status(201).json(await Engineer.findByIdAndUpdate(userId,
              {
                isHeadOfDepartment: req.body.isHeadOfDepartment,
                department: req.body.department
              }
          ).exec())
      }
    } else {
        return res.status(401).send("Unauthorized");
    }
  } catch (e) {
    res.status(500).json(e);
  }
});

//TODO Togliere la funzionalità cambio ruolo 
/*
router.put("/:userId/role", async function (req, res) {
  const userId = req.params.userId;
  try {
    if (userId !== res.locals.uid && res.locals.role === process.env.ROLE_TP) {
      res
          .status(200)
          .send(
              await User.findByIdAndUpdate(userId, {role: req.body.role})
          );
    } else {
        if(userId !== res.locals.uid){
          return res.status(401).send("As TeamPrincipal you can not change your role");
        }
        else{
          return res.status(401).send("Unauthorized");
        }
      }
  } catch (e) {
    res.status(500).json(e);
  }
});
 */

router.post("/", async function (req, res) {
  const userId = res.locals.uid;
  const role = req.body.role;
  try {
    const user = await User.findById(userId).exec();
    if (user == null) {
      let newUser = new User({
        _id: res.locals.uid,
        email: res.locals.email,
        first_name: req.body.first_name,
        surname: req.body.surname,
        role: req.body.role,
      });
      await newUser.save();
      
      const readRole = String(role);
      switch (readRole) {
        case "team_principal":
          let newTeam;
          newTeam = new Team({
            userId: [res.locals.uid],
            name: req.body.name,
            board: new Board(),
            gallery: new Gallery(),
            calendar: new Calendar(),
            history: [],
            departments: [],
          });
          await newTeam.save();
          let newTP;
          newTP = new TeamPrincipal ({
            _id: res.locals.uid,
            email: res.locals.email,
            first_name: req.body.first_name,
            surname: req.body.surname,
            role: role,
            team: newTeam
          });
          await newTP.save();
          return res.status(201).json(await TeamPrincipal.findById(userId).exec());
        case "pilot":
          let newDriver;
          newDriver= new Driver({
            _id: res.locals.uid,
            email: res.locals.email,
            first_name: req.body.first_name,
            surname: req.body.surname,
            role: role,
            driver_num: req.body.driver_num,
            license_points: req.body.license_points,
            isRacing: req.body.isRacing,
          });
          await newDriver.save();
          return res.status(201).json(await Driver.findById(userId).exec());
        case "engineer":
          let newEng;
          newEng= new Engineer({
            _id: res.locals.uid,
            email: res.locals.email,
            first_name: req.body.first_name,
            surname: req.body.surname,
            role: req.body.role,
            isHeadOfDepartment: req.body.isHeadOfDepartment,
            department: req.body.department
          });
          await newEng.save();
          return res.status(201).json(await Engineer.findById(userId));
        case "social_media_manager":
          let newSM;
          newSM= new MediaManager({
            _id: res.locals.uid,
            email: res.locals.email,
            first_name: req.body.first_name,
            surname: req.body.surname,
            role: req.body.role,
          });
          await newSM.save();
          return res.status(201).json(await MediaManager.findById(userId));
        default:
          return res.status(401).json({error: "Invalid role"});
      }
    }
    else{
      return res.status(401).json({error: "User already exists"});
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.delete("/:userId", async function (req, res) {
  const userId = req.params.userId;
  try {
    if (userId !== res.locals.uid && res.locals.role === process.env.ROLE_TP) {
      const user = await User.findById(userId).exec();
      switch (String(user.role)){
        case "pilot":
          await Driver.findByIdAndDelete(userId).exec();
          break;
        case "social_media_manager":
          await MediaManager.findByIdAndDelete(userId).exec();
          break;
        case "team_principal":
          await TeamPrincipal.findByIdAndDelete(userId).exec();
          break;
        case "engineer":
          await Engineer.findByIdAndDelete(userId).exec();
          break;
      }
      return res.status(200).json(await User.findByIdAndDelete(userId).exec());
    } else {
      return res.status(401).json({error: "Unauthorized"});
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

module.exports = router;
