const { z } = require("zod");

const registerTeamSchema = z.object({
  teamId: z.coerce.number().int().positive()
});

const addPlayersSchema = z.object({
  playerIds: z.array(
    z.coerce.number().int().positive()
  ).min(1)
}).refine(
  (data) => new Set(data.playerIds).size === data.playerIds.length,
  "Duplicate player IDs are not allowed"
);

module.exports = {
  registerTeamSchema,
  addPlayersSchema
};