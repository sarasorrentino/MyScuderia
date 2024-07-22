let express = require("express");
let router = express.Router();
const { Team } = require("../shared/team.model");
const { User } = require("../shared/user.model");
const { Record } = require("../shared/record.model");
const { Calendar } = require("../shared/calendar.model");
const { Gallery } = require("../shared/gallery.model");
const { Department } = require("../shared/department.model");
const { Board } = require("../shared/board.model");

router.get("/:teamId", async function (req, res) {
  const teamId = req.params.teamId;
  console.log("Your team: " + res.locals.team);
  console.log("Your id: " + res.locals.uid);
  try {
    if (teamId === res.locals.team) {
      const team = await Team.findById(teamId).exec();
      if (!team) {
        return res.status(404).send("Team does not exists");
      }
      return res.status(200).json(team);
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

router.get("/:teamId/users", async function (req, res) {
  const teamId = req.params.teamId;
  try {
    if (teamId === res.locals.team) {
      const teamUsers = await Team.findById({ _id: teamId }, "userId").exec();
      return res.status(200).json(teamUsers);
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

router.get("/:teamId/history", async function (req, res) {
  const teamId = req.params.teamId;
  try {
    if (teamId === res.locals.team) {
      const teamHistory = await Team.findById(
        { _id: teamId },
        "history"
      ).exec();
      return res.status(200).json(teamHistory);
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

router.put("/:teamId", async function (req, res) {
  const teamId = req.params.teamId;
  try {
    if (res.locals.role === process.env.ROLE_TP && teamId === res.locals.team) {
      return res
        .status(200)
        .json(await Team.findByIdAndUpdate(teamId, req.body).exec());
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

router.put("/:teamId/editTeam/:userId", async function (req, res) {
  const teamId = req.params.teamId;
  const userId = req.params.userId;
  try {
    if (res.locals.role === process.env.ROLE_TP && teamId === res.locals.team) {
      const team = await Team.findById(teamId).exec();
      let users = team["userId"];
      for (let i = 0; i < users.length; i++) {
        if (users[i] === userId) {
          return res.status(401).send("User already in team");
        }
      }
      users.push(userId);
      return res
        .status(200)
        .json(await Team.findByIdAndUpdate(teamId, { userId: users }).exec());
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

router.put("/:teamId/addRecord", async function (req, res) {
  const teamId = req.params.teamId;
  try {
    if (teamId === res.locals.team && res.locals.role === process.env.ROLE_SM) {
      const team = await Team.findById({ _id: teamId }, "history").exec();
      const history = team["history"];
      console.log(history);
      for (let i = 0; i < history.length; i++) {
        if (
          history[i].nameOfGP == req.body.nameOfGP &&
          history[i].year == req.body.year
        ) {
          return res.status(401).send("Record already saved");
        }
      }
      const record = new Record({
        year: req.body.year,
        nameOfGP: req.body.nameOfGP,
        pilotId: req.body.pilotId,
        placement: req.body.placement,
        isPole: req.body.isPole,
        isFastest: req.body.isFastest,
      });
      await record.save();
      history.push(record);
      await Team.findByIdAndUpdate(teamId, { history: history }).exec();
      return res.status(200).json(record);
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

router.delete("/:teamId/removeUser/:userId", async function (req, res) {
  const teamId = req.params.teamId;
  const userId = req.params.userId;
  try {
    if (teamId === res.locals.team && res.locals.role === process.env.ROLE_TP) {
      const team = await Team.findById(teamId).exec();
      let users = team["userId"];
      let updatedList = [];
      for (let i = 0; i < users.length; i++) {
        if (users[i] !== userId) {
          updatedList.push(users[i]);
        }
      }
      console.log(updatedList);
      return res
        .status(200)
        .json(
          await Team.findByIdAndUpdate(teamId, { userId: updatedList }).exec()
        );
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

router.delete("/:teamId/removeRecord/:recordId", async function (req, res) {
  const teamId = req.params.teamId;
  const recordId = req.params.recordId;
  try {
    if (teamId === res.locals.team && res.locals.role === process.env.ROLE_TP) {
      const team = await Team.findById(teamId).exec();
      let history = team["history"];
      let updatedList = [];
      for (let i = 0; i < history.length; i++) {
        console.log("history[i]=" + history[i]._id + " recordId=" + recordId);
        if (history[i]._id != recordId) {
          updatedList.push(history[i]);
        }
      }
      return res
        .status(200)
        .json(
          await Team.findByIdAndUpdate(teamId, { history: updatedList }).exec()
        );
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

router.delete("/:teamId/delete", async function (req, res) {
  const teamId = req.params.teamId;
  try {
    if (teamId === res.locals.team && res.locals.role === process.env.ROLE_TP) {
      let team = await Team.findById(teamId).exec();
      let users = [User];
      let deps = [Department];
      for (let i = 0; i < team["userId"].length; i++) {
        await User.findByIdAndUpdate(users[i]["_id"], { teamId: null }).exec();
      }
      for (let i = 0; i < team.get("departments").length; i++) {
        await Department.findByIdAndUpdate(deps[i]["_id"], {
          teamId: null,
        }).exec();
      }
      await Calendar.findByIdAndUpdate(team.get("calendar"), {
        team: null,
      }).exec();
      await Gallery.findByIdAndUpdate(team.get("calendar"), {
        team: null,
      }).exec();
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

router.post("/", async function (req, res) {
  const teamName = req.body.name;
  try {
    const team = await Team.exists({ name: req.body.name }).exec();
    if (team == null) {
      if (res.locals.role === process.env.ROLE_TP) {
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
        /*await team.verify();*/
        return res.status(201).json(await newTeam.save());
      } else {
        res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      res.status(401).json({ error: "Team already exists" });
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = router;
