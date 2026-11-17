const express = require("express");

const teamController = require("../controllers/team.controller");

const {
  authenticate,
  authorizeRoles,
} = require("../middleware/auth.middleware");

const validate = require("../middleware/validate.middleware");

const {
  createTeamSchema,
  updateTeamSchema,
} = require("../validators/team.validator");

const router = express.Router();

// Public read routes
router.get("/", teamController.getAllTeams);
router.get("/:id", teamController.getTeamById);

// Organizer/Admin write routes
router.post(
  "/",
  authenticate,
  authorizeRoles("ORGANIZER", "ADMIN"),
  validate(createTeamSchema),
  teamController.createTeam
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("ORGANIZER", "ADMIN"),
  validate(updateTeamSchema),
  teamController.updateTeam
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("ORGANIZER", "ADMIN"),
  teamController.deleteTeam
);

module.exports = router;