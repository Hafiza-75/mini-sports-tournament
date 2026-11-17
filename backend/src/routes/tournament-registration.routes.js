const express = require("express");
const router = express.Router();

const controller = require("../controllers/registration.controller");

const {
  authenticate,
  authorizeRoles
} = require("../middleware/auth.middleware");

const validate = require("../middleware/validate.middleware");

const {
  registerTeamSchema,
  addPlayersSchema
} = require("../validators/registration.validator");

const organizerAccess = [
  authenticate,
  authorizeRoles("ORGANIZER", "ADMIN")
];

// Public: Approved teams
router.get("/:id/teams", controller.getApprovedTeams);

// Organizer: View registrations
router.get(
  "/:id/registrations",
  ...organizerAccess,
  controller.getRegistrations
);

// Organizer: Register team
router.post(
  "/:id/register",
  ...organizerAccess,
  validate(registerTeamSchema),
  controller.registerTeam
);

// Organizer: Add players to registered team
router.post(
  "/:id/teams/:teamId/players",
  ...organizerAccess,
  validate(addPlayersSchema),
  controller.addPlayersToTeam
);

module.exports = router;