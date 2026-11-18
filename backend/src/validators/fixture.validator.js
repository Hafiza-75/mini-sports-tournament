
const { z } = require("zod");

const generateFixturesSchema = z.object({});

const updateMatchScheduleSchema = z.object({
  matchDate: z.string().datetime().optional().nullable(),
  venue: z.string().trim().max(200).optional().nullable()
}).refine(
  (data) => Object.keys(data).length > 0,
  "At least one schedule field is required"
);

module.exports = {
  generateFixturesSchema,
  updateMatchScheduleSchema
};
