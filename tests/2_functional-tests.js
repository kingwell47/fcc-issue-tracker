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
          assert.equal(assigned_to, "");
          assert.equal(status_text, "");
          assert.isTrue(open);
          if (err) console.log(err);
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
          assert.equal(res.body.error, "required field(s) missing");
          done();
        });
    });
  });

  suite("GET tests", () => {
    // View issues on a project: GET request to /api/issues/{project}
    test(" View issues on a project", (done) => {
      chai
        .request(server)
        .get("/api/issues/apitest")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.isArray(res.body);
          done();
        });
    });
    // View issues on a project with one filter: GET request to /api/issues/{project}
    test(" View issues on a project with one filter", (done) => {
      chai
        .request(server)
        .get("/api/issues/apitest?created_by=Jingo")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.isArray(res.body);
          assert.equal(res.body.length, 3);
          done();
        });
    });
    // View issues on a project with multiple filters: GET request to /api/issues/{project}
    test(" View issues on a project with multiple filters", (done) => {
      chai
        .request(server)
        .get("/api/issues/apitest?created_by=Jingo&open=true")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.isArray(res.body);
          assert.equal(res.body.length, 2);
          done();
        });
    });
  });
  let count = 0;
  const counter = () => count++;
  suite("PUT tests", () => {
    // Update one field on an issue: PUT request to /api/issues/{project}
    test("Update one field on an issue", (done) => {
      counter();
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send({
          _id: "618e1eec101022fdd675a295",
          issue_title: `Updating title ${count}`,
        })
        .type("application/x-www-form-urlencoded")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body._id, "618e1eec101022fdd675a295");
          assert.equal(res.body.issue_title, `Updating title ${count}`);
          done();
        });
    });
    // Update multiple fields on an issue: PUT request to /api/issues/{project}
    test("Update multiple fields on an issue", (done) => {
      counter();
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send({
          _id: "618e1eec101022fdd675a295",
          issue_text: `Updating text ${count}`,
          created_by: `Updating created by ${count}`,
          assigned_to: `Updating assigned_to ${count}`,
          status_text: `Updating status_text ${count}`,
        })
        .type("application/x-www-form-urlencoded")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body._id, "618e1eec101022fdd675a295");
          assert.equal(res.body.issue_text, `Updating text ${count}`);
          assert.equal(res.body.created_by, `Updating created by ${count}`);
          assert.equal(res.body.assigned_to, `Updating assigned_to ${count}`);
          assert.equal(res.body.status_text, `Updating status_text ${count}`);
          done();
        });
    });
    // Update an issue with missing _id: PUT request to /api/issues/{project}
    test("Update an issue with missing _id", (done) => {
      counter();
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send({
          issue_text: `Updating text ${count}`,
          created_by: `Updating created by ${count}`,
          assigned_to: `Updating assigned_to ${count}`,
          status_text: `Updating status_text ${count}`,
        })
        .type("application/x-www-form-urlencoded")
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.type, "application/json");
          assert.notEqual(res.body._id, "618e1eec101022fdd675a295");
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });
    // Update an issue with no fields to update: PUT request to /api/issues/{project}
    test("Update an issue with no fields to update", (done) => {
      counter();
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send({
          _id: "618e1eec101022fdd675a295",
        })
        .type("application/x-www-form-urlencoded")
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.type, "application/json");
          assert.equal(res.body._id, "618e1eec101022fdd675a295");
          assert.equal(res.body.error, "no update field(s) sent");
          done();
        });
    });
    // Update an issue with an invalid _id: PUT request to /api/issues/{project}
    test("Update an issue with an invalid _id", (done) => {
      counter();
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send({
          _id: "somefakerandomidthatdoesntexist",
          issue_text: `Updating text ${count}`,
          created_by: `Updating created by ${count}`,
          assigned_to: `Updating assigned_to ${count}`,
          status_text: `Updating status_text ${count}`,
        })
        .type("application/x-www-form-urlencoded")
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.type, "application/json");
          assert.equal(res.body._id, "somefakerandomidthatdoesntexist");
          assert.equal(res.body.error, "could not update");
          done();
        });
    });
  });
  suite("DELETE tests", () => {
    // Delete an issue: DELETE request to /api/issues/{project}
    // Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
    // Delete an issue with missing _id: DELETE request to /api/issues/{project}
  });
});
