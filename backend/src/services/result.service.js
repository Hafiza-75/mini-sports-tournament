
const prisma = require("../config/prisma");

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function checkMatchAccess(matchId, user) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { tournament: true }
  });

  if (!match) {
    throw createError("Match not found", 404);
  }

  if (
    user.role !== "ADMIN" &&
    match.tournament.organizerId !== user.id
  ) {
    throw createError("Not authorized to manage this match", 403);
  }

  if (match.status === "CANCELLED") {
    throw createError("Cancelled matches cannot have results", 400);
  }

  return match;
}

// Calculate match outcome
function calculateOutcome(homeScore, awayScore) {
  if (homeScore > awayScore) {
    return "WIN";
  }

  if (awayScore > homeScore) {
    return "WIN";
  }

  return "TIE";
}

// Create or update match result
async function saveResult(matchId, data, user, isUpdate = false) {
  const match = await checkMatchAccess(matchId, user);

  const existingResult = await prisma.matchResult.findUnique({
    where: { matchId }
  });

  if (existingResult && !isUpdate) {
    throw createError(
      "Result already exists. Use PUT to update it.",
      409
    );
  }

  if (!existingResult && isUpdate) {
    throw createError(
      "Result not found. Use POST to create it.",
      404
    );
  }

  // Determine outcome
  const outcome = data.outcome || calculateOutcome(
    data.homeScore,
    data.awayScore
  );

  // DRAW can represent an abandoned/no-result match
  if (
    outcome === "DRAW" &&
    data.homeScore !== data.awayScore
  ) {
    // Explicit DRAW is allowed even when scores differ.
  }

  // Determine winner
  let winnerTeamId = null;

  if (outcome !== "DRAW" && data.homeScore > data.awayScore) {
    winnerTeamId = match.homeTeamId;
  } else if (
    outcome !== "DRAW" &&
    data.awayScore > data.homeScore
  ) {
    winnerTeamId = match.awayTeamId;
  }

  const resultData = {
    homeScore: data.homeScore,
    awayScore: data.awayScore,
    outcome,
    winnerTeamId,
    notes: data.notes ?? null
  };

  return prisma.$transaction(async (tx) => {
    await tx.matchResult.upsert({
      where: { matchId },
      create: {
        matchId,
        ...resultData
      },
      update: resultData
    });

    const updatedMatch = await tx.match.update({
      where: { id: matchId },
      data: { status: "COMPLETED" },
      include: {
        homeTeam: true,
        awayTeam: true,
        result: true
      }
    });

    return updatedMatch;
  });
}

// Create result
async function createResult(matchId, data, user) {
  return saveResult(matchId, data, user, false);
}

// Update result
async function updateResult(matchId, data, user) {
  return saveResult(matchId, data, user, true);
}

// Get single match result
async function getResult(matchId) {
  const result = await prisma.matchResult.findUnique({
    where: { matchId },
    include: {
      match: {
        include: {
          homeTeam: true,
          awayTeam: true,
          tournament: true
        }
      }
    }
  });

  if (!result) {
    throw createError("Result not found", 404);
  }

  return result;
}

// Get all tournament results
async function getTournamentResults(tournamentId) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId }
  });

  if (!tournament) {
    throw createError("Tournament not found", 404);
  }

  return prisma.matchResult.findMany({
    where: {
      match: { tournamentId }
    },
    include: {
      match: {
        include: {
          homeTeam: true,
          awayTeam: true
        }
      }
    },
    orderBy: {
      matchId: "asc"
    }
  });
}

module.exports = {
  createResult,
  updateResult,
  getResult,
  getTournamentResults
};
