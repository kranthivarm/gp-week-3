const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const restrictTenant = require("../middleware/tenant.middleware");
const { DataOfDashBD } = require("../controllers/dashboard.controller");

router.get("/summary", authenticate, restrictTenant, DataOfDashBD);

module.exports = router;
