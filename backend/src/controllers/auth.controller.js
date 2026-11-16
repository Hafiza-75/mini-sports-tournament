
const authService = require("../services/auth.service");

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);

    return res.status(201).json({
      success: true,
      message: "Organizer registered successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const profile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  profile
};
