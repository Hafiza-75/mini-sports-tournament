const express = require("express");
const router = express.Router();

const controller = require("../controllers/registration.controller");

const {
  authenticate,
  authorizeRoles
} = require("../middleware/auth.middleware");

router.patch(
  "/:id/approve",
  authenticate,
  authorizeRoles("ORGANIZER", "ADMIN"),
  controller.approveRegistration
);

router.patch(
  "/:id/reject",
  authenticate,
  authorizeRoles("ORGANIZER", "ADMIN"),
  controller.rejectRegistration
);

module.exports = router;