const prisma = require("../config/prisma");

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Create Player
const createPlayer = async (data) => {
  return prisma.player.create({
    data: {
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      age: data.age ?? null,
      role: data.role || null
    }
  });
};

// Get All Players
const getAllPlayers = async () => {
  return prisma.player.findMany({
    include: {
      registrations: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

// Get Player By ID
const getPlayerById = async (id) => {
  const player = await prisma.player.findUnique({
    where: { id },
    include: {
      registrations: {
        include: {
          tournament: true,
          team: true
        }
      },
      matchStats: true,
      captainOf: true
    }
  });

  if (!player) {
    throw createError("Player not found", 404);
  }

  return player;
};

// Update Player
const updatePlayer = async (id, data) => {
  const existingPlayer = await prisma.player.findUnique({
    where: { id }
  });

  if (!existingPlayer) {
    throw createError("Player not found", 404);
  }

  return prisma.player.update({
    where: { id },
    data: {
      ...data,
      email: data.email === "" ? null : data.email,
      phone: data.phone === "" ? null : data.phone,
      role: data.role === "" ? null : data.role
    }
  });
};

// Delete Player
const deletePlayer = async (id) => {
  const player = await prisma.player.findUnique({
    where: { id },
    include: {
      registrations: true,
      matchStats: true,
      captainOf: true
    }
  });

  if (!player) {
    throw createError("Player not found", 404);
  }

  if (
    player.registrations.length > 0 ||
    player.matchStats.length > 0 ||
    player.captainOf.length > 0
  ) {
    throw createError(
      "Player cannot be deleted because they are linked to tournament records, match stats, or a team captain record",
      409
    );
  }

  return prisma.player.delete({
    where: { id }
  });
};

module.exports = {
  createPlayer,
  getAllPlayers,
  getPlayerById,
  updatePlayer,
  deletePlayer
};