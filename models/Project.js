const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_on: { type: String, default: Date.now },
  updated_on: { type: String, default: Date.now },
  created_by: { type: String, required: true },
  assigned_to: String,
  open: Boolean,
  status_text: String,
});

const projectSchema = new mongoose.Schema({
  project: { type: String, required: true },
  issues: [issueSchema],
});

module.exports = mongoose.model("Project", projectSchema);
