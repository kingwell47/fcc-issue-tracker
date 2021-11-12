"use strict";

const Project = require("../models/Project");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(async function (req, res) {
      let project = req.params.project;
      try {
        const projectData = await Project.findOne({ project });
        if (!projectData) return res.json([]);
        return res.json(projectData.issues);
      } catch (err) {
        console.log(err.message);
        res.json("server error");
      }
    })

    .post(async function (req, res) {
      let project = req.params.project;
      let { issue_title, issue_text, created_by, assigned_to, status_text } =
        req.body;
      if (!issue_title || !issue_text || !created_by)
        return res.json("Required field missing");
      try {
        const projectData = await Project.findOneAndUpdate(
          {
            project,
          },
          {
            $push: {
              issues: {
                issue_title,
                issue_text,
                created_by,
                assigned_to,
                open: true,
                status_text,
              },
            },
          },
          { new: true, upsert: true }
        );
        await projectData.save();
        res.json("created new issue");
      } catch (err) {
        console.log(err.message);
        res.json("server error");
      }
    })

    .put(async function (req, res) {
      let project = req.params.project;
      //Also needs to update information
      let {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open,
      } = req.body;

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
        await projectData.save();
        res.json("updated issue");
      } catch (err) {
        console.log(err.message);
        res.json("server error");
      }
    })

    .delete(async function (req, res) {
      let project = req.params.project;
      try {
        const projectData = await Project.findOne({
          project,
        });
        await projectData.issues.id(req.body._id).remove();
        await projectData.save();
        res.json("deleted issue");
      } catch (err) {
        console.log(err.message);
        res.json("server error");
      }
    });
};
