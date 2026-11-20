const { z } = require("zod");

const playerStatsSchema = z.object({
  stats: z.array(
    z.object({
      playerId: z.number().int().positive(),
      teamId: z.number().int().positive(),
      runs: z.number().int().min(0),
      wickets: z.number().int().min(0),
      ballsFaced: z.number().int().min(0),
      ballsBowled: z.number().int().min(0)
    })
  ).min(1)
});

module.exports = { playerStatsSchema };