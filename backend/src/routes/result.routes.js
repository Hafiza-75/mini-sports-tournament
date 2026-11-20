const express = require("express");
const router = express.Router();

const resultController = require("../controllers/result.controller");

const {
  authenticate,
  authorizeRoles
} = require("../middleware/auth.middleware");

const { resultSchema } = require("../validators/result.validator");
const validate = require("../middleware/validate.middleware");

const organizerAccess = [
  authenticate,
  authorizeRoles("ORGANIZER", "ADMIN")
];

router.post(
  "/:matchId",
  ...organizerAccess,
  validate(resultSchema),
  resultController.createResult
);

router.put(
  "/:matchId",
  ...organizerAccess,
  validate(resultSchema),
  resultController.updateResult
);

router.get(
  "/:matchId",
  resultController.getResult
);

router.get(
  "/tournament/:tournamentId",
  resultController.getTournamentResults
);

module.exports = router;