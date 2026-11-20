const prisma = require("../config/prisma");

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function getTournamentPlayerStats(tournamentId) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId }
  });

  if (!tournament) {
    throw createError("Tournament not found", 404);
  }

  const stats = await prisma.playerMatchStat.findMany({
    where: {
      match: {
        tournamentId,
        status: "COMPLETED"
      }
    },
    include: {
      player: true,
      team: true
    }
  });

  const players = new Map();

  for (const stat of stats) {
    if (!players.has(stat.playerId)) {
      players.set(stat.playerId, {
        playerId: stat.playerId,
        playerName: stat.player.name,
        teamId: stat.teamId,
        teamName: stat.team.name,
        totalRuns: 0,
        totalWickets: 0,
        matches: new Set()
      });
    }

    const player = players.get(stat.playerId);

    player.totalRuns += stat.runs;
    player.totalWickets += stat.wickets;
    player.matches.add(stat.matchId);
  }

  return [...players.values()].map((player) => ({
    ...player,
    matchesPlayed: player.matches.size,
    matches: undefined
  }));
}

async function getTopRunScorers(tournamentId) {
  const players = await getTournamentPlayerStats(tournamentId);

  return players
    .sort((a, b) =>
      b.totalRuns - a.totalRuns ||
      b.totalWickets - a.totalWickets ||
      a.playerName.localeCompare(b.playerName)
    )
    .slice(0, 5);
}

async function getTopWicketTakers(tournamentId) {
  const players = await getTournamentPlayerStats(tournamentId);

  return players
    .sort((a, b) =>
      b.totalWickets - a.totalWickets ||
      b.totalRuns - a.totalRuns ||
      a.playerName.localeCompare(b.playerName)
    )
    .slice(0, 5);
}

module.exports = {
  getTopRunScorers,
  getTopWicketTakers
};