"use strict";

const Project = require("../models/Project");

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
                assigned_to,
                open: true,
                status_text,
                // Add created and updated on columns with correct time formats
              },
            },
          },
          { upsert: true }
        );
        if (projectData) await projectData.save();
        res.json("created new issue");
      } catch (err) {
        console.log(err.message);
        res.json("server error");
      }
    })

    .put(async function (req, res) {
      let project = req.params.project;
      //Update Issue to open: false, update time updated
      console.log("put");
    })

    .delete(async function (req, res) {
      let project = req.params.project;
      //delete Issue
    });
};
