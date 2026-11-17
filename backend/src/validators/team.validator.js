const { z } = require("zod");

const createTeamSchema = z.object({
  name: z.string().trim().min(2).max(100),
  logo: z.string().trim().url().optional().or(z.literal("")),
  captainId: z.coerce.number().int().positive().optional().nullable(),
});

const updateTeamSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  logo: z.string().trim().url().optional().or(z.literal("")),
  captainId: z.coerce.number().int().positive().optional().nullable(),
}).refine(
  (data) => Object.keys(data).length > 0,
  "At least one field is required"
);

module.exports = {
  createTeamSchema,
  updateTeamSchema,
};