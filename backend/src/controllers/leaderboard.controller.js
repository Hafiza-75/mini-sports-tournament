const leaderboardService = require("../services/leaderboard.service");

const getTopRunScorers = async (req, res, next) => {
  try {
    const data = await leaderboardService.getTopRunScorers(
      Number(req.params.tournamentId)
    );

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    next(error);
  }
};

const getTopWicketTakers = async (req, res, next) => {
  try {
    const data = await leaderboardService.getTopWicketTakers(
      Number(req.params.tournamentId)
    );

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTopRunScorers,
  getTopWicketTakers
};