
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const createToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d"
    }
  );
};

const register = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "ORGANIZER"
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });

  const token = createToken(user);

  return { user, token };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };

  const token = createToken(safeUser);

  return {
    user: safeUser,
    token
  };
};

const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

module.exports = {
  register,
  login,
  getProfile
};
