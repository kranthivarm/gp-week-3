const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/rbac.middleware");
const enforceTenant = require("../middleware/tenant.middleware");

const {
  listTasks,
  updateTask,
} = require("../controllers/tasks.controller");
 
router.use(authenticate, enforceTenant);
 
router.get("/", listTasks);
 
router.put("/:taskId", authorizeRoles("tenant_admin"), updateTask);

module.exports = router;
