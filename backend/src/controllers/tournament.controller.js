const tournamentService = require("../services/tournament.service");

const createTournament = async (req, res, next) => {
  try {
    const tournament = await tournamentService.createTournament(
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: "Tournament created successfully",
      data: tournament,
    });
  } catch (error) {
    next(error);
  }
};

const getAllTournaments = async (req, res, next) => {
  try {
    const tournaments = await tournamentService.getAllTournaments();

    res.status(200).json({
      success: true,
      count: tournaments.length,
      data: tournaments,
    });
  } catch (error) {
    next(error);
  }
};

const getTournamentById = async (req, res, next) => {
  try {
    const tournament = await tournamentService.getTournamentById(
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: tournament,
    });
  } catch (error) {
    next(error);
  }
};

const updateTournament = async (req, res, next) => {
  try {
    const tournament = await tournamentService.updateTournament(
      req.params.id,
      req.body,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: "Tournament updated successfully",
      data: tournament,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTournament = async (req, res, next) => {
  try {
    await tournamentService.deleteTournament(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: "Tournament deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTournament,
  getAllTournaments,
  getTournamentById,
  updateTournament,
  deleteTournament,
};