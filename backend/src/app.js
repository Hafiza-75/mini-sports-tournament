
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const tournamentRoutes = require("./routes/tournament.routes");
const teamRoutes = require("./routes/team.routes");
const playerRoutes = require("./routes/player.routes");

const tournamentRegistrationRoutes = require("./routes/tournament-registration.routes");
const registrationRoutes = require("./routes/registration.routes");

const {
  notFound,
  errorHandler,
} = require("./middleware/error.middleware");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
}));

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Mini Sports Tournament API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/players", playerRoutes);

app.use("/api/tournaments", tournamentRegistrationRoutes);
app.use("/api/registrations", registrationRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
