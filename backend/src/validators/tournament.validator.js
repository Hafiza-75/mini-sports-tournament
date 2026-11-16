const { z } = require("zod");

const tournamentStatuses = [
  "DRAFT",
  "REGISTRATION_OPEN",
  "ONGOING",
  "COMPLETED",
];

const createTournamentSchema = z.object({
  name: z.string().trim().min(3).max(100),
  description: z.string().trim().max(1000).optional().nullable(),
  startDate: z.string().refine(
    (value) => !Number.isNaN(Date.parse(value)),
    "Invalid start date"
  ),
  endDate: z.string().refine(
    (value) => !Number.isNaN(Date.parse(value)),
    "Invalid end date"
  ),
  maxTeams: z.coerce.number().int().min(2),
  format: z.string().default("LEAGUE"),
  status: z.enum(tournamentStatuses).default("DRAFT"),
}).refine(
  (data) => new Date(data.endDate) > new Date(data.startDate),
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
);

const updateTournamentSchema = z.object({
  name: z.string().trim().min(3).max(100).optional(),
  description: z.string().trim().max(1000).nullable().optional(),
  startDate: z.string().refine(
    (value) => !Number.isNaN(Date.parse(value)),
    "Invalid start date"
  ).optional(),
  endDate: z.string().refine(
    (value) => !Number.isNaN(Date.parse(value)),
    "Invalid end date"
  ).optional(),
  maxTeams: z.coerce.number().int().min(2).optional(),
  format: z.string().optional(),
  status: z.enum(tournamentStatuses).optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  "At least one field is required"
);

module.exports = {
  createTournamentSchema,
  updateTournamentSchema,
};