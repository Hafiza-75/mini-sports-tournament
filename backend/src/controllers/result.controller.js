const resultService = require("../services/result.service");

const createResult = async (req, res, next) => {
  try {
    const result = await resultService.createResult(
      Number(req.params.matchId),
      req.body,
      req.user
    );

    res.status(201).json({
      success: true,
      message: "Match result recorded successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const updateResult = async (req, res, next) => {
  try {
    const result = await resultService.updateResult(
      Number(req.params.matchId),
      req.body,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Match result updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getResult = async (req, res, next) => {
  try {
    const result = await resultService.getResult(
      Number(req.params.matchId)
    );

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getTournamentResults = async (req, res, next) => {
  try {
    const results = await resultService.getTournamentResults(
      Number(req.params.tournamentId)
    );

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createResult,
  updateResult,
  getResult,
  getTournamentResults
};