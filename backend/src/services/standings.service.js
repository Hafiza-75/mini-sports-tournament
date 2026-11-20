const prisma = require("../config/prisma");

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function getStandings(tournamentId) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: {
      teams: {
        where: { status: "APPROVED" },
        include: { team: true }
      },
      matches: {
        where: { status: "COMPLETED" },
        include: { result: true }
      }
    }
  });

  if (!tournament) {
    throw createError("Tournament not found", 404);
  }

  const standings = tournament.teams.map((registration) => ({
    teamId: registration.team.id,
    teamName: registration.team.name,
    matchesPlayed: 0,
    wins: 0,
    losses: 0,
    ties: 0,
    draws: 0,
    runsScored: 0,
    runsConceded: 0,
    scoreDifference: 0,
    points: 0
  }));

  const teamMap = new Map(
    standings.map((team) => [team.teamId, team])
  );

  for (const match of tournament.matches) {
    if (!match.result) continue;

    const home = teamMap.get(match.homeTeamId);
    const away = teamMap.get(match.awayTeamId);

    if (!home || !away) continue;

    const result = match.result;

    home.matchesPlayed++;
    away.matchesPlayed++;

    home.runsScored += result.homeScore;
    home.runsConceded += result.awayScore;

    away.runsScored += result.awayScore;
    away.runsConceded += result.homeScore;

    if (result.outcome === "WIN") {
      if (result.winnerTeamId === match.homeTeamId) {
        home.wins++;
        away.losses++;
        home.points += tournament.winPoints;
        away.points += tournament.lossPoints;
      } else if (result.winnerTeamId === match.awayTeamId) {
        away.wins++;
        home.losses++;
        away.points += tournament.winPoints;
        home.points += tournament.lossPoints;
      }
    } else if (result.outcome === "TIE") {
      home.ties++;
      away.ties++;
      home.points += tournament.tiePoints;
      away.points += tournament.tiePoints;
    } else if (result.outcome === "DRAW") {
      home.draws++;
      away.draws++;
      home.points += tournament.tiePoints;
      away.points += tournament.tiePoints;
    }
  }

  standings.forEach((team) => {
    team.scoreDifference = team.runsScored - team.runsConceded;
  });

  standings.sort((a, b) =>
    b.points - a.points ||
    b.scoreDifference - a.scoreDifference ||
    b.runsScored - a.runsScored ||
    a.teamName.localeCompare(b.teamName)
  );

  return standings.map((team, index) => ({
    position: index + 1,
    ...team
  }));
}

module.exports = { getStandings };