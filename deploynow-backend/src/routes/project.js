const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { createProject, getProjectDetails,getAllProjectsForUser, redeployProject } = require("../controllers/projectController");

router.get("/", auth, getAllProjectsForUser);
router.get("/:projectId", auth, getProjectDetails);
router.post("/createproject", auth, createProject);
router.post("/redeploy/:projectId", auth, redeployProject);

module.exports = router;
