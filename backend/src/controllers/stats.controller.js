const statsService = require("../services/stats.service");

const savePlayerStats = async (req, res, next) => {
  try {
    const stats = await statsService.savePlayerStats(
      Number(req.params.matchId),
      req.body,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Player stats saved successfully",
      count: stats.length,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

const getMatchStats = async (req, res, next) => {
  try {
    const stats = await statsService.getMatchStats(
      Number(req.params.matchId)
    );

    res.status(200).json({
      success: true,
      count: stats.length,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

const getPlayerStats = async (req, res, next) => {
  try {
    const stats = await statsService.getPlayerStats(
      Number(req.params.playerId)
    );

    res.status(200).json({
      success: true,
      count: stats.length,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  savePlayerStats,
  getMatchStats,
  getPlayerStats
};