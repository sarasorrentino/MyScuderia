let express = require("express");
const { Department } = require("../shared/department.model");
const { Team } = require("../shared/team.model");
const { Component } = require("../shared/component.model");
const {Gallery} = require("../shared/gallery.model");
let router = express.Router();

//Ottengo dipartimenti del team
router.get("/:teamId", async function (req, res) {
  const teamId = req.params.teamId;
  try {
    if (res.locals.team === teamId) {
      return res.status(200).json(await Team.findById(teamId, "departments").exec());
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

//Ottengo specifico dipartimento
router.get("/:teamId/:deptId", async function (req, res) {
  const teamId = req.params.teamId;
  const deptId = req.params.deptId;
  try {
    if (res.locals.team === teamId) {
      return res.status(200).json(await Department.findById(deptId).exec());
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

//Ottengo i componenti di uno specifico dipartimento
router.get("/:teamId/:deptId/component", async function (req, res) {
  const teamId = req.params.teamId;
  const deptId = req.params.deptId;
  try {
    if (res.locals.team === teamId) {
      const dept = await Department.findById(deptId).exec();
      const comp = dept["components"];
      console.log(comp);
      return res.status(200).json(comp);
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

//Ottengo specifico componente di un dipartimento
router.get("/:teamId/:deptId/component/:compId", async function (req, res) {
  const teamId = req.params.teamId;
  const deptId = req.params.deptId;
  const compId = req.params.compId;

  try {
    if (res.locals.team === teamId) {
      const dept = await Department.findById(deptId).exec();
      console.log(dept);
      const comp = dept["components"];
      console.log(comp);
      for(let i = 0; i < comp.length; i++){
        if(comp[i]._id == compId){
          return res.status(200).json(comp[i]);
        }
      }
      return res.status(404).json({error: "Component not found"});
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }

});

router.put("/:teamId/:deptId", async function (req, res) {
  const teamId = req.params.teamId;
  const deptId = req.params.deptId;
  try {
    let manager = await Department.findById(deptId);
    if (
      res.locals.team === teamId &&
      res.locals.role === process.env.ROLE_E
    ) {
      let newDep = new Department;
      newDep= await Department.findByIdAndUpdate(deptId, {
        caption: req.body.caption,
      });
      console.log(newDep);
      let team = await Team.findById(teamId, "departments");
      let deps = team["departments"];
      let newDeps = [];
      for(let i = 0; i < deps.length; i++){
        console.log(deps[i]._id + "  " + deptId);
        if(deps[i]._id == deptId){
          newDeps.push(newDep);
        }
        else{
          newDeps.push(deps[i]);
        }
      }
      console.log(newDeps);
      await Team.findByIdAndUpdate(teamId, {departments: newDeps})
      return res
        .status(200)
        .json(await Department.findById(deptId)
        );
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

//TODO Non apporta alcuna modifica
router.put("/:teamId/:deptId/component/:compId", async function (req, res) {
  const teamId = req.params.teamId;
  const deptId = req.params.deptId;
  const compId = req.params.compId;
  try {
    let manager = await Department.findById(deptId);
    if (
      res.locals.team === teamId &&
      res.locals.role === process.env.ROLE_E
    ) {
      await Component.findByIdAndUpdate(compId, {n_available: req.body.n_available}).exec();
      const team = await Team.findById(teamId, "departments").exec();
      const deps = team["departments"];
      console.log(deps);
      let updateDeps = [];
      let updateComps = [];
      for(let i = 0; i < deps.length; i++){
        if(deps[i]._id == deptId){
          const components = deps[i]["components"];
          for(let j = 0; j < components.length; j++){
            if(components[i]._id == compId){
              deps[i]["components"].n_available = req.body.n_available;
            }
            await Department.findByIdAndUpdate(deptId, {components: deps[i]["components"]}).exec();
            updateComps.push(components[i]);
          }
        }
        updateDeps.push(deps[i]);
      }

      await Team.findByIdAndUpdate(teamId, {departments: updateDeps});
      return res
        .status(200)
        .json(
          await Team.findById(teamId, "departments")
        );
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
      let dep;
      dep = new Department({
        name: req.body.name,
        caption: req.body.caption,
        manager: res.locals.uid,
      });
      await dep.save();
      const team = await Team.findById(teamId, "departments").exec();
      const deps = team["departments"];
      deps.push(dep);
      await Team.findByIdAndUpdate(teamId, {departments: deps}).exec()

      return res.status(201).json( await Team.findById(teamId).exec()
      );
    } else {
      return res.status(401).json({error: "Unauthorized"});
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

router.post("/:teamId/:deptId/component", async function (req, res) {
  const teamId = req.params.teamId;
  const deptId = req.params.deptId;
  try {
    let manager = await Department.findById(deptId);
    if (
      res.locals.team === teamId &&
      res.locals.role === process.env.ROLE_E &&
      manager["manager"] === res.locals.uid
    ) {
      const comp = Component({
        name: req.body.name,
        description: req.body.description,
        n_available: req.body.n_available,
        depId: deptId,
      });
      await comp.save();

      const team = await Team.findById(teamId, "departments").exec();
      const deps = team["departments"];

      let updateComps = [];
      for(let i = 0; i < deps.length; i++){
        console.log(deps[i]);

        if(deps[i]._id == deptId){
          updateComps = deps[i]["components"];
          updateComps.push(comp)
          console.log("push" + deps[i]);

          const newDep = await Department.findByIdAndUpdate(deptId, {components: updateComps});
        }
      }

      const newDipartimenti = await Department.findByIdAndUpdate(deptId);
      await Team.findByIdAndUpdate(teamId, {departments: newDipartimenti});
      return res.status(201).json(comp);
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

//TODO
router.delete("/:teamId/:deptId", async function (req, res) {
  const teamId = req.params.teamId;
  const deptId = req.params.deptId;
  try {
    if (res.locals.team === teamId && res.locals.role === process.env.ROLE_TP) {
      await Department.findOneAndDelete(deptId).exec();
      return res.status(200).send();
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

//TODO
router.delete("/:teamId/:deptId/component/:compId", async function (req, res) {
  const teamId = req.params.teamId;
  const deptId = req.params.deptId;
  const compId = req.params.compId;
  try {
    if (
      res.locals.team === teamId &&
      res.locals.role === process.env.ROLE_E
    ) {
      await Component.findOneAndDelete(compId).exec();

      const team = await Team.findById(teamId, "departments").exec();
      const deps = team["departments"];

      let updateComps = [];
      for(let i = 0; i < deps.length; i++){
        console.log(deps[i]);

        if(deps[i]._id != deptId){
          updateComps.push(deps[i])
          console.log("push" + deps[i]);

        }
      }
      const newDep = await Department.findByIdAndUpdate(deptId, {components: updateComps});
      await Team.findByIdAndUpdate(teamId, {departments: newDep});

    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (e) {
    return res.status(500).json(e.message);
  }
});

module.exports = router;
