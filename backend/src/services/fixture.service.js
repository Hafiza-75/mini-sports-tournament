
const prisma = require("../config/prisma");
const generateRoundRobinFixtures = require("../utils/fixture-generator");

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

// Generate tournament fixtures
const generateFixtures = async (tournamentId, user) => {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId }
  });

  if (!tournament) {
    throw createError("Tournament not found", 404);
  }

  // Only tournament organizer or admin
  if (
    user.role !== "ADMIN" &&
    tournament.organizerId !== user.id
  ) {
    throw createError("Not authorized to manage this tournament", 403);
  }

  // Tournament must have approved teams
  const registrations = await prisma.tournamentTeam.findMany({
    where: {
      tournamentId,
      status: "APPROVED"
    },
    include: {
      team: true
    }
  });

  if (registrations.length < 2) {
    throw createError("At least 2 approved teams are required", 400);
  }

  // Prevent generating fixtures multiple times
  const existingMatches = await prisma.match.count({
    where: { tournamentId }
  });

  if (existingMatches > 0) {
    throw createError(
      "Fixtures have already been generated for this tournament",
      409
    );
  }

  const teams = registrations.map((registration) => registration.team);

  const fixtures = generateRoundRobinFixtures(teams);

  // Store fixtures in database
  const createdFixtures = await prisma.$transaction(
    fixtures.map((fixture) =>
      prisma.match.create({
        data: {
          tournamentId,
          homeTeamId: fixture.homeTeamId,
          awayTeamId: fixture.awayTeamId,
          round: fixture.round
        }
      })
    )
  );

  return {
    tournamentId,
    totalTeams: teams.length,
    totalRounds: teams.length % 2 === 0
      ? teams.length - 1
      : teams.length,
    totalMatches: createdFixtures.length,
    fixtures: createdFixtures
  };
};

// Get tournament fixtures
const getFixtures = async (tournamentId) => {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId }
  });

  if (!tournament) {
    throw createError("Tournament not found", 404);
  }

  return prisma.match.findMany({
    where: { tournamentId },
    include: {
      homeTeam: true,
      awayTeam: true,
      result: true
    },
    orderBy: [
      { round: "asc" },
      { id: "asc" }
    ]
  });
};

// Update match schedule
const updateMatchSchedule = async (matchId, data, user) => {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { tournament: true }
  });

  if (!match) {
    throw createError("Match not found", 404);
  }

  // Only tournament organizer or admin
  if (
    user.role !== "ADMIN" &&
    match.tournament.organizerId !== user.id
  ) {
    throw createError("Not authorized to update this match", 403);
  }

  // Only scheduled matches can be updated
  if (match.status !== "SCHEDULED") {
    throw createError(
      "Only scheduled matches can be updated",
      400
    );
  }

  const updateData = {};

  if (data.matchDate !== undefined) {
    updateData.matchDate = data.matchDate
      ? new Date(data.matchDate)
      : null;
  }

  if (data.venue !== undefined) {
    updateData.venue = data.venue || null;
  }

  return prisma.match.update({
    where: { id: matchId },
    data: updateData,
    include: {
      homeTeam: true,
      awayTeam: true
    }
  });
};

module.exports = {
  generateFixtures,
  getFixtures,
  updateMatchSchedule
};
