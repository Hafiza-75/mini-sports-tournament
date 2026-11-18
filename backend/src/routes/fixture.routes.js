
const express = require("express");
const router = express.Router();

const fixtureController = require("../controllers/fixture.controller");

const {
  authenticate,
  authorizeRoles
} = require("../middleware/auth.middleware");

const {
  updateMatchScheduleSchema
} = require("../validators/fixture.validator");

const validate = require("../middleware/validate.middleware");

const organizerAccess = [
  authenticate,
  authorizeRoles("ORGANIZER", "ADMIN")
];

// Generate fixtures — organizer only
router.post(
  "/:id/generate",
  ...organizerAccess,
  fixtureController.generateFixtures
);

// Update match schedule — organizer/admin only
router.put(
  "/matches/:matchId/schedule",
  ...organizerAccess,
  validate(updateMatchScheduleSchema),
  fixtureController.updateMatchSchedule
);

// View fixtures — public
router.get(
  "/:id",
  fixtureController.getFixtures
);

module.exports = router;
