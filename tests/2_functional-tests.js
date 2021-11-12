const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite("POST Tests", () => {
    // Create an issue with every field: POST request to /api/issues/{project}
    test("Create an issue with every field", (done) => {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send({
          issue_title: "Testing title",
          issue_text: "Testing text",
          created_by: "Testing created by",
          assigned_to: "Testing assigned to",
          status_text: "Testing status text",
        })
        .type("application/x-www-form-urlencoded")
        .end((err, res) => {
          const {
            issue_title,
            issue_text,
            created_by,
            assigned_to,
            status_text,
            open,
          } = res.body;
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(issue_title, "Testing title");
          assert.equal(issue_text, "Testing text");
          assert.equal(created_by, "Testing created by");
          assert.equal(assigned_to, "Testing assigned to");
          assert.equal(status_text, "Testing status text");
          assert.isTrue(open);
          done();
        });
    });
    // Create an issue with only required fields: POST request to /api/issues/{project}
    test("Create an issue with only required fields", (done) => {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send({
          issue_title: "Testing title",
          issue_text: "Testing text",
          created_by: "Testing created by",
        })
        .type("application/x-www-form-urlencoded")
        .end((err, res) => {
          const {
            issue_title,
            issue_text,
            created_by,
            assigned_to,
            status_text,
            open,
          } = res.body;
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(issue_title, "Testing title");
          assert.equal(issue_text, "Testing text");
          assert.equal(created_by, "Testing created by");
          assert.isUndefined(assigned_to);
          assert.isUndefined(status_text);
          assert.isTrue(open);
          done();
        });
    });
    // Create an issue with missing required fields: POST request to /api/issues/{project}
    test("Create an issue with missing required fields", (done) => {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send({
          issue_title: "Testing title",
          issue_text: "Testing text",
        })
        .type("application/x-www-form-urlencoded")
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.type, "application/json");
          assert.equal(res.body, "Required field missing");
          done();
        });
    });
  });

  suite("GET tests", () => {
    // View issues on a project: GET request to /api/issues/{project}
    // View issues on a project with one filter: GET request to /api/issues/{project}
    // View issues on a project with multiple filters: GET request to /api/issues/{project}
  });

  suite("PUT tests", () => {
    // Update one field on an issue: PUT request to /api/issues/{project}
    // Update multiple fields on an issue: PUT request to /api/issues/{project}
    // Update an issue with missing _id: PUT request to /api/issues/{project}
    // Update an issue with no fields to update: PUT request to /api/issues/{project}
    // Update an issue with an invalid _id: PUT request to /api/issues/{project}
  });
  suite("DELETE tests", () => {
    // Delete an issue: DELETE request to /api/issues/{project}
    // Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
    // Delete an issue with missing _id: DELETE request to /api/issues/{project}
  });
});
