const express = require("express");
const router = express.Router();

const statsController = require("../controllers/stats.controller");

const {
  authenticate,
  authorizeRoles
} = require("../middleware/auth.middleware");

const { playerStatsSchema } = require("../validators/stats.validator");
const validate = require("../middleware/validate.middleware");

const organizerAccess = [
  authenticate,
  authorizeRoles("ORGANIZER", "ADMIN")
];

router.post(
  "/:matchId",
  ...organizerAccess,
  validate(playerStatsSchema),
  statsController.savePlayerStats
);

router.get("/:matchId", statsController.getMatchStats);

router.get("/player/:playerId", statsController.getPlayerStats);

module.exports = router;