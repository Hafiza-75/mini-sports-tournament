const prisma = require("../config/prisma");

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const checkTournamentAccess = async (tournamentId, user) => {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId }
  });

  if (!tournament) {
    throw createError("Tournament not found", 404);
  }

  if (
    user.role !== "ADMIN" &&
    tournament.organizerId !== user.id
  ) {
    throw createError(
      "You are not authorized to manage this tournament",
      403
    );
  }

  return tournament;
};

// Register Team
const registerTeam = async (tournamentId, teamId, user) => {
  const tournament = await checkTournamentAccess(tournamentId, user);

  if (tournament.status !== "REGISTRATION_OPEN") {
    throw createError(
      "Tournament registration is not currently open",
      400
    );
  }

  const team = await prisma.team.findUnique({
    where: { id: teamId }
  });

  if (!team) {
    throw createError("Team not found", 404);
  }

  const existing = await prisma.tournamentTeam.findUnique({
    where: {
      tournamentId_teamId: {
        tournamentId,
        teamId
      }
    }
  });

  if (existing && existing.status !== "REJECTED") {
    throw createError(
      "This team is already registered in this tournament",
      409
    );
  }

  const activeCount = await prisma.tournamentTeam.count({
    where: {
      tournamentId,
      status: {
        in: ["PENDING", "APPROVED"]
      }
    }
  });

  if (!existing && activeCount >= tournament.maxTeams) {
    throw createError(
      "Tournament has reached its maximum team limit",
      400
    );
  }

  if (existing) {
    return prisma.tournamentTeam.update({
      where: { id: existing.id },
      data: {
        status: "PENDING",
        registeredAt: new Date()
      },
      include: { team: true }
    });
  }

  return prisma.tournamentTeam.create({
    data: {
      tournamentId,
      teamId,
      status: "PENDING"
    },
    include: { team: true }
  });
};

// Get All Registrations (Organizer Only)
const getRegistrations = async (tournamentId, user) => {
  await checkTournamentAccess(tournamentId, user);

  return prisma.tournamentTeam.findMany({
    where: { tournamentId },
    include: {
      team: true
    },
    orderBy: {
      registeredAt: "desc"
    }
  });
};

// Approve Registration
const approveRegistration = async (registrationId, user) => {
  const registration = await prisma.tournamentTeam.findUnique({
    where: { id: registrationId },
    include: { tournament: true }
  });

  if (!registration) {
    throw createError("Registration not found", 404);
  }

  await checkTournamentAccess(registration.tournamentId, user);

  if (registration.status !== "PENDING") {
    throw createError(
      "Only pending registrations can be approved",
      400
    );
  }

  return prisma.tournamentTeam.update({
    where: { id: registrationId },
    data: { status: "APPROVED" },
    include: { team: true }
  });
};

// Reject Registration
const rejectRegistration = async (registrationId, user) => {
  const registration = await prisma.tournamentTeam.findUnique({
    where: { id: registrationId },
    include: { tournament: true }
  });

  if (!registration) {
    throw createError("Registration not found", 404);
  }

  await checkTournamentAccess(registration.tournamentId, user);

  if (registration.status !== "PENDING") {
    throw createError(
      "Only pending registrations can be rejected",
      400
    );
  }

  return prisma.tournamentTeam.update({
    where: { id: registrationId },
    data: { status: "REJECTED" },
    include: { team: true }
  });
};

// Add Players to a Team in a Tournament
const addPlayersToTeam = async (
  tournamentId,
  teamId,
  playerIds,
  user
) => {
  await checkTournamentAccess(tournamentId, user);

  const registration = await prisma.tournamentTeam.findUnique({
    where: {
      tournamentId_teamId: {
        tournamentId,
        teamId
      }
    }
  });

  if (!registration || registration.status === "REJECTED") {
    throw createError(
      "Team does not have an active registration in this tournament",
      400
    );
  }

  const players = await prisma.player.findMany({
    where: {
      id: { in: playerIds }
    },
    select: { id: true }
  });

  if (players.length !== playerIds.length) {
    throw createError(
      "One or more players do not exist",
      404
    );
  }

  const existingPlayers = await prisma.tournamentPlayer.findMany({
    where: {
      tournamentId,
      playerId: { in: playerIds }
    }
  });

  const alreadyInOtherTeam = existingPlayers.find(
    (item) => item.teamId !== teamId
  );

  if (alreadyInOtherTeam) {
    throw createError(
      `Player ${alreadyInOtherTeam.playerId} already represents another team in this tournament`,
      409
    );
  }

  await prisma.tournamentPlayer.createMany({
    data: playerIds.map((playerId) => ({
      tournamentId,
      teamId,
      playerId
    })),
    skipDuplicates: true
  });

  return prisma.tournamentPlayer.findMany({
    where: {
      tournamentId,
      teamId
    },
    include: {
      player: true
    }
  });
};

// Public: Get Approved Teams
const getApprovedTeams = async (tournamentId) => {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId }
  });

  if (!tournament) {
    throw createError("Tournament not found", 404);
  }

  return prisma.tournamentTeam.findMany({
    where: {
      tournamentId,
      status: "APPROVED"
    },
    include: {
      team: {
        include: {
          tournamentPlayers: {
            where: { tournamentId },
            include: { player: true }
          }
        }
      }
    }
  });
};

module.exports = {
  registerTeam,
  getRegistrations,
  approveRegistration,
  rejectRegistration,
  addPlayersToTeam,
  getApprovedTeams
};