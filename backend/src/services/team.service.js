const prisma = require("../config/prisma");

const createTeam = async (data) => {
  if (data.captainId) {
    const captain = await prisma.player.findUnique({
      where: { id: data.captainId },
    });

    if (!captain) {
      const error = new Error("Captain player not found");
      error.statusCode = 404;
      throw error;
    }
  }

  return prisma.team.create({
    data: {
      name: data.name,
      logo: data.logo || null,
      captainId: data.captainId || null,
    },
    include: {
      captain: true,
    },
  });
};

const getAllTeams = async () => {
  return prisma.team.findMany({
    include: {
      captain: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getTeamById = async (id) => {
  const team = await prisma.team.findUnique({
    where: { id: Number(id) },
    include: {
      captain: true,
      tournamentTeams: true,
      tournamentPlayers: {
        include: {
          player: true,
        },
      },
    },
  });

  if (!team) {
    const error = new Error("Team not found");
    error.statusCode = 404;
    throw error;
  }

  return team;
};

const updateTeam = async (id, data) => {
  const team = await prisma.team.findUnique({
    where: { id: Number(id) },
  });

  if (!team) {
    const error = new Error("Team not found");
    error.statusCode = 404;
    throw error;
  }

  if (data.captainId) {
    const captain = await prisma.player.findUnique({
      where: { id: data.captainId },
    });

    if (!captain) {
      const error = new Error("Captain player not found");
      error.statusCode = 404;
      throw error;
    }
  }

  return prisma.team.update({
    where: { id: Number(id) },
    data: {
      ...data,
      logo: data.logo === "" ? null : data.logo,
    },
    include: {
      captain: true,
    },
  });
};

const deleteTeam = async (id) => {
  const team = await prisma.team.findUnique({
    where: { id: Number(id) },
    include: {
      tournamentTeams: true,
      tournamentPlayers: true,
      homeMatches: true,
      awayMatches: true,
    },
  });

  if (!team) {
    const error = new Error("Team not found");
    error.statusCode = 404;
    throw error;
  }

  if (
    team.tournamentTeams.length > 0 ||
    team.tournamentPlayers.length > 0 ||
    team.homeMatches.length > 0 ||
    team.awayMatches.length > 0
  ) {
    const error = new Error(
      "Team cannot be deleted because it is already associated with tournaments or matches"
    );
    error.statusCode = 409;
    throw error;
  }

  return prisma.team.delete({
    where: { id: Number(id) },
  });
};

module.exports = {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
};