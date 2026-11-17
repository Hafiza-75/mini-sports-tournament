const service = require("../services/registration.service");

const registerTeam = async (req, res, next) => {
  try {
    const data = await service.registerTeam(
      Number(req.params.id),
      req.body.teamId,
      req.user
    );

    res.status(201).json({
      success: true,
      message: "Team registration submitted successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};

const getRegistrations = async (req, res, next) => {
  try {
    const data = await service.getRegistrations(
      Number(req.params.id),
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Registrations fetched successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};

const approveRegistration = async (req, res, next) => {
  try {
    const data = await service.approveRegistration(
      Number(req.params.id),
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Registration approved successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};

const rejectRegistration = async (req, res, next) => {
  try {
    const data = await service.rejectRegistration(
      Number(req.params.id),
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Registration rejected successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};

const addPlayersToTeam = async (req, res, next) => {
  try {
    const data = await service.addPlayersToTeam(
      Number(req.params.id),
      Number(req.params.teamId),
      req.body.playerIds,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Players added to tournament team successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};

const getApprovedTeams = async (req, res, next) => {
  try {
    const data = await service.getApprovedTeams(
      Number(req.params.id)
    );

    res.status(200).json({
      success: true,
      message: "Approved teams fetched successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerTeam,
  getRegistrations,
  approveRegistration,
  rejectRegistration,
  addPlayersToTeam,
  getApprovedTeams
};