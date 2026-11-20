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
    throw createError("Not authorized to manage player stats", 403);
  }

  return match;
}

async function savePlayerStats(matchId, data, user) {
  const match = await checkMatchAccess(matchId, user);

  const submittedPlayerIds = data.stats.map((item) => item.playerId);

  if (new Set(submittedPlayerIds).size !== submittedPlayerIds.length) {
    throw createError("Duplicate players in stats request", 400);
  }

  for (const item of data.stats) {
    if (
      item.teamId !== match.homeTeamId &&
      item.teamId !== match.awayTeamId
    ) {
      throw createError("Player team is not participating in this match", 400);
    }

    const registration = await prisma.tournamentPlayer.findUnique({
      where: {
        tournamentId_playerId: {
          tournamentId: match.tournamentId,
          playerId: item.playerId
        }
      }
    });

    if (!registration || registration.teamId !== item.teamId) {
      throw createError(
        `Player ${item.playerId} is not registered with this team in this tournament`,
        400
      );
    }
  }

  return prisma.$transaction(
    data.stats.map((item) =>
      prisma.playerMatchStat.upsert({
        where: {
          matchId_playerId: {
            matchId,
            playerId: item.playerId
          }
        },
        create: {
          matchId,
          playerId: item.playerId,
          teamId: item.teamId,
          runs: item.runs,
          wickets: item.wickets,
          ballsFaced: item.ballsFaced,
          ballsBowled: item.ballsBowled
        },
        update: {
          teamId: item.teamId,
          runs: item.runs,
          wickets: item.wickets,
          ballsFaced: item.ballsFaced,
          ballsBowled: item.ballsBowled
        }
      })
    )
  );
}

async function getMatchStats(matchId) {
  const match = await prisma.match.findUnique({
    where: { id: matchId }
  });

  if (!match) {
    throw createError("Match not found", 404);
  }

  return prisma.playerMatchStat.findMany({
    where: { matchId },
    include: {
      player: true,
      team: true
    },
    orderBy: { runs: "desc" }
  });
}

async function getPlayerStats(playerId) {
  const player = await prisma.player.findUnique({
    where: { id: playerId }
  });

  if (!player) {
    throw createError("Player not found", 404);
  }

  return prisma.playerMatchStat.findMany({
    where: { playerId },
    include: {
      match: true,
      team: true
    },
    orderBy: { id: "desc" }
  });
}

module.exports = {
  savePlayerStats,
  getMatchStats,
  getPlayerStats
};