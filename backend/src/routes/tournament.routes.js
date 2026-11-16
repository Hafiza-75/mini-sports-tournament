const express = require("express");

const tournamentController = require("../controllers/tournament.controller");
const { authenticate, authorizeRoles } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");

const {
  createTournamentSchema,
  updateTournamentSchema,
} = require("../validators/tournament.validator");

const router = express.Router();

// Public routes
router.get("/", tournamentController.getAllTournaments);
router.get("/:id", tournamentController.getTournamentById);

// Organizer-only routes
router.post(
  "/",
  authenticate,
  authorizeRoles("ORGANIZER", "ADMIN"),
  validate(createTournamentSchema),
  tournamentController.createTournament
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("ORGANIZER", "ADMIN"),
  validate(updateTournamentSchema),
  tournamentController.updateTournament
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("ORGANIZER", "ADMIN"),
  tournamentController.deleteTournament
);

module.exports = router;