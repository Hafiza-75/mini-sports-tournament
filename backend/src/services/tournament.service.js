const prisma = require("../config/prisma");

const createTournament = async (data, organizerId) => {
  if (new Date(data.endDate) <= new Date(data.startDate)) {
    const error = new Error("End date must be after start date");
    error.statusCode = 400;
    throw error;
  }

  return prisma.tournament.create({
    data: {
      name: data.name,
      description: data.description || null,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      maxTeams: data.maxTeams,
      format: data.format || "LEAGUE",
      status: data.status || "DRAFT",
      organizerId: Number(organizerId),
    },
  });
};

const getAllTournaments = async () => {
  return prisma.tournament.findMany({
    where: {
      status: {
        not: "DRAFT",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getTournamentById = async (id) => {
  const tournament = await prisma.tournament.findUnique({
    where: { id: Number(id) },
  });

  if (!tournament || tournament.status === "DRAFT") {
    const error = new Error("Tournament not found");
    error.statusCode = 404;
    throw error;
  }

  return tournament;
};

const updateTournament = async (id, data, organizerId) => {
  const tournament = await prisma.tournament.findUnique({
    where: { id: Number(id) },
  });

  if (!tournament) {
    const error = new Error("Tournament not found");
    error.statusCode = 404;
    throw error;
  }

  if (tournament.organizerId !== Number(organizerId)) {
    const error = new Error("You are not allowed to update this tournament");
    error.statusCode = 403;
    throw error;
  }

  const startDate = data.startDate
    ? new Date(data.startDate)
    : tournament.startDate;

  const endDate = data.endDate
    ? new Date(data.endDate)
    : tournament.endDate;

  if (endDate <= startDate) {
    const error = new Error("End date must be after start date");
    error.statusCode = 400;
    throw error;
  }

  return prisma.tournament.update({
    where: { id: Number(id) },
    data: {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    },
  });
};

const deleteTournament = async (id, organizerId) => {
  const tournament = await prisma.tournament.findUnique({
    where: { id: Number(id) },
  });

  if (!tournament) {
    const error = new Error("Tournament not found");
    error.statusCode = 404;
    throw error;
  }

  if (tournament.organizerId !== Number(organizerId)) {
    const error = new Error("You are not allowed to delete this tournament");
    error.statusCode = 403;
    throw error;
  }

  return prisma.tournament.delete({
    where: { id: Number(id) },
  });
};

module.exports = {
  createTournament,
  getAllTournaments,
  getTournamentById,
  updateTournament,
  deleteTournament,
};