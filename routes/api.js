"use strict";

const Project = require("../models/Project");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = function (app) {
  //https://www.geeksforgeeks.org/how-to-check-if-a-string-is-valid-mongodb-objectid-in-node-js/
  function isValidObjectId(id) {
    if (ObjectId.isValid(id)) {
      if (String(new ObjectId(id)) === id) return true;
      return false;
    }
    return false;
  }

  app
    .route("/api/issues/:project")

    .get(async function (req, res) {
      let project = req.params.project;
      const queryFilter = { ...req.query };
      try {
        Project.findOne(
          {
            project,
          },
          async (err, data) => {
            if (req.query.length === 0) return res.json(data.issues);
            const issueData = data.issues.filter((item) => {
              // if (item.open.toString() === req.query.open) return true;
              for (let key in queryFilter) {
                if (
                  item[key] === undefined ||
                  item[key].toString() !== queryFilter[key]
                )
                  return false;
              }
              return true;
            });
            return await res.json(issueData);
          }
        );
        // if (!projectData) return res.json([]);
        // return res.json(projectData.issues);
      } catch (err) {
        console.log(err.message);
        res.json("server error");
      }
    })

    .post(async function (req, res) {
      let project = req.params.project;
      let {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
      } = req.body;
      if (!issue_title || !issue_text || !created_by)
        return res.json({ error: "required field(s) missing" });
      let newId;
      isValidObjectId(_id) ? (newId = _id) : (newId = new ObjectId());
      try {
        let newIssue = {
          _id: newId,
          open: true,
          issue_title,
          issue_text,
          created_by,
        };

        assigned_to
          ? (newIssue["assigned_to"] = assigned_to)
          : (newIssue["assigned_to"] = "");

        status_text
          ? (newIssue["status_text"] = status_text)
          : (newIssue["status_text"] = "");

        const projectData = await Project.findOneAndUpdate(
          {
            project,
          },
          {
            $push: {
              issues: newIssue,
            },
          },
          { new: true, upsert: true }
        );
        await projectData.save();
        // console.log(projectData.issues);
        return res.json(projectData.issues.id(newId));
      } catch (err) {
        console.log(err.message);
        res.json("server error");
      }
    })

    .put(async function (req, res) {
      let project = req.params.project;
      const {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open,
      } = req.body;
      if (!_id || !isValidObjectId(_id))
        return res.json({ error: "missing _id" });
      if (
        !issue_title &&
        !issue_text &&
        !created_by &&
        !assigned_to &&
        !status_text &&
        !open
      )
        return res.json({ error: "no update field(s) sent", _id: _id });
      try {
        const projectData = await Project.findOneAndUpdate(
          {
            project,
            "issues._id": _id,
          },
          {
            "issues.$.issue_title": issue_title || undefined,
            "issues.$.issue_text": issue_text || undefined,
            "issues.$.created_by": created_by || undefined,
            "issues.$.assigned_to": assigned_to || undefined,
            "issues.$.status_text": status_text || undefined,
            "issues.$.open": open || undefined,
          },
          { new: true }
        );
        if (!projectData)
          return res.json({ error: "could not update", _id: _id });
        await projectData.save();
        return res.json({ result: "successfully updated", _id: _id });
      } catch (err) {
        console.log(err.message);
        res.json("server error");
      }
    })

    .delete(async function (req, res) {
      let project = req.params.project;
      if (!req.body._id) return res.json({ error: "missing _id" });
      try {
        const projectData = await Project.findOne({
          project,
        });
        let currentIssue = await projectData.issues.id(req.body._id);
        if (!currentIssue)
          return res.json({ error: "could not delete", _id: req.body._id });
        await projectData.issues.id(req.body._id).remove();
        await projectData.save();
        return res.json({ result: "successfully deleted", _id: req.body._id });
      } catch (err) {
        console.log(err.message);
        res.json("server error");
      }
    });
};
