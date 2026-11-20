const standingsService = require("../services/standings.service");

const getStandings = async (req, res, next) => {
  try {
    const standings = await standingsService.getStandings(
      Number(req.params.tournamentId)
    );

    res.status(200).json({
      success: true,
      count: standings.length,
      data: standings
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStandings };