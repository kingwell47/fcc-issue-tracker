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
                created_on: new Date().toJSON(),
                updated_on: new Date().toJSON(),
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

      try {
        const projectData = await Project.findOneAndUpdate(
          {
            project,
            "issues._id": req.body._id,
          },
          {
            $set: {
              "issues.$.open": req.body.open,
              "issues.$.updated_on": new Date().toJSON(),
            },
          }
        );
        await projectData.save();
        res.json("closed issue");
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
