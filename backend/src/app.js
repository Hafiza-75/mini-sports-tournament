
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const tournamentRoutes = require("./routes/tournament.routes");

const {
  notFound,
  errorHandler
} = require("./middleware/error.middleware");

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

// Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Mini Sports Tournament API is running"
  });
});

// Authentication Routes
app.use("/api/auth", authRoutes);

// Tournament Routes
app.use("/api/tournaments", tournamentRoutes);

// 404 and Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
