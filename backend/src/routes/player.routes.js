const express = require("express");
const router = express.Router();

const playerController = require("../controllers/player.controller");

const {
  authenticate,
  authorizeRoles
} = require("../middleware/auth.middleware");

const validate = require("../middleware/validate.middleware");

const {
  createPlayerSchema,
  updatePlayerSchema
} = require("../validators/player.validator");

// Public read routes
router.get("/", playerController.getAllPlayers);
router.get("/:id", playerController.getPlayerById);

// Protected write routes
router.post(
  "/",
  authenticate,
  authorizeRoles("ORGANIZER", "ADMIN"),
  validate(createPlayerSchema),
  playerController.createPlayer
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("ORGANIZER", "ADMIN"),
  validate(updatePlayerSchema),
  playerController.updatePlayer
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("ORGANIZER", "ADMIN"),
  playerController.deletePlayer
);

module.exports = router;