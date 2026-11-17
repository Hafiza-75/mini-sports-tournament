const playerService = require("../services/player.service");

const createPlayer = async (req, res, next) => {
  try {
    const player = await playerService.createPlayer(req.body);

    res.status(201).json({
      success: true,
      message: "Player created successfully",
      data: player
    });
  } catch (error) {
    next(error);
  }
};

const getAllPlayers = async (req, res, next) => {
  try {
    const players = await playerService.getAllPlayers();

    res.status(200).json({
      success: true,
      message: "Players fetched successfully",
      data: players
    });
  } catch (error) {
    next(error);
  }
};

const getPlayerById = async (req, res, next) => {
  try {
    const player = await playerService.getPlayerById(
      Number(req.params.id)
    );

    res.status(200).json({
      success: true,
      message: "Player fetched successfully",
      data: player
    });
  } catch (error) {
    next(error);
  }
};

const updatePlayer = async (req, res, next) => {
  try {
    const player = await playerService.updatePlayer(
      Number(req.params.id),
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Player updated successfully",
      data: player
    });
  } catch (error) {
    next(error);
  }
};

const deletePlayer = async (req, res, next) => {
  try {
    await playerService.deletePlayer(Number(req.params.id));

    res.status(200).json({
      success: true,
      message: "Player deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPlayer,
  getAllPlayers,
  getPlayerById,
  updatePlayer,
  deletePlayer
};