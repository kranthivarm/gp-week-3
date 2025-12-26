const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/rbac.middleware");
const enforceTenant = require("../middleware/tenant.middleware");
const { createTask } = require("../controllers/tasks.controller");


const {
  createProject,
  listProjects,
  updateProject,
  archiveProject,
} = require("../controllers/projects.controller");
router.get(
  "/",
  authenticate,
  authorizeRoles("tenant_admin", "user"),
  enforceTenant,
  listProjects
);
router.post(
  "/",
  authenticate,
  authorizeRoles("tenant_admin"),
  enforceTenant,
  createProject
);
router.put(
  "/:projectId",
  authenticate,
  authorizeRoles("tenant_admin"),
  enforceTenant,
  updateProject
);
router.delete(
  "/:projectId",
  authenticate,
  authorizeRoles("tenant_admin"),
  enforceTenant,
  archiveProject
);
router.post(
  "/:projectId/tasks",
  authenticate,
  authorizeRoles("tenant_admin"),
  enforceTenant,
  createTask
);


module.exports = router;
