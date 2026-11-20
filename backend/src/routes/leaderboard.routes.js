const express = require("express");
const router = express.Router();

const leaderboardController = require("../controllers/leaderboard.controller");

router.get(
  "/:tournamentId/runs",
  leaderboardController.getTopRunScorers
);

router.get(
  "/:tournamentId/wickets",
  leaderboardController.getTopWicketTakers
);

module.exports = router;