
const fixtureService = require("../services/fixture.service");

// Generate fixtures
const generateFixtures = async (req, res, next) => {
  try {
    const data = await fixtureService.generateFixtures(
      Number(req.params.id),
      req.user
    );

    res.status(201).json({
      success: true,
      message: "Fixtures generated successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};

// Get fixtures
const getFixtures = async (req, res, next) => {
  try {
    const data = await fixtureService.getFixtures(
      Number(req.params.id)
    );

    res.status(200).json({
      success: true,
      message: "Fixtures fetched successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};

// Update match schedule
const updateMatchSchedule = async (req, res, next) => {
  try {
    const data = await fixtureService.updateMatchSchedule(
      Number(req.params.matchId),
      req.body,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Match schedule updated successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateFixtures,
  getFixtures,
  updateMatchSchedule
};
