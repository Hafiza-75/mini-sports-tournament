const { z } = require("zod");

const createPlayerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  age: z.coerce.number().int().min(5).max(100).optional().nullable(),
  role: z.string().trim().max(50).optional().or(z.literal(""))
});

const updatePlayerSchema = createPlayerSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field is required"
  );

module.exports = {
  createPlayerSchema,
  updatePlayerSchema
};