
const { z } = require("zod");

const resultSchema = z.object({
  homeScore: z.number().int().min(0),

  awayScore: z.number().int().min(0),

  notes: z.string().trim().max(500).optional().nullable(),

  outcome: z.enum(["DRAW"]).optional()
});

module.exports = {
  resultSchema
};
