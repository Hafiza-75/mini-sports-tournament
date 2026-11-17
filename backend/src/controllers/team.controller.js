const teamService = require("../services/team.service");

const createTeam = async (req, res, next) => {
  try {
    const team = await teamService.createTeam(req.body);

    res.status(201).json({
      success: true,
      message: "Team created successfully",
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

const getAllTeams = async (req, res, next) => {
  try {
    const teams = await teamService.getAllTeams();

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams,
    });
  } catch (error) {
    next(error);
  }
};

const getTeamById = async (req, res, next) => {
  try {
    const team = await teamService.getTeamById(req.params.id);

    res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

const updateTeam = async (req, res, next) => {
  try {
    const team = await teamService.updateTeam(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Team updated successfully",
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTeam = async (req, res, next) => {
  try {
    await teamService.deleteTeam(req.params.id);

    res.status(200).json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
};