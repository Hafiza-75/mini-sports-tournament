
import { useEffect, useState } from "react";

import {
  registerUser,
  loginUser,
  getProfile
} from "./services/authService";

import TournamentDashboard from "./components/TournamentDashboard";

import "./App.css";

function App() {
  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(!!token);

  // Verify existing login session
  useEffect(() => {
    if (!token) {
      setProfileLoading(false);
      return;
    }

    getProfile(token)
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setProfileLoading(false);
      });

  }, [token]);

  // Handle input changes
  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  // Handle login and registration
  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      let response;

      if (mode === "register") {
        response = await registerUser(form);
      } else {
        response = await loginUser({
          email: form.email,
          password: form.password
        });
      }

      const newToken = response.data.token;

      localStorage.setItem("token", newToken);

      setToken(newToken);
      setUser(response.data.user);

      setForm({
        name: "",
        email: "",
        password: ""
      });

      setMessage(response.message);

    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);

    setMessage("You have logged out successfully.");
  };

  // Loading session
  if (profileLoading) {
    return (
      <main className="auth-container">
        <section className="auth-card">
          <p>Verifying your session...</p>
        </section>
      </main>
    );
  }

  // Authenticated user dashboard
  if (user) {
    return (
      <main className="dashboard-container">

        <header className="dashboard-header">
          <div>
            <h1>Mini Sports Tournament</h1>
            <p>Welcome, {user.name}!</p>
          </div>

          <button onClick={handleLogout}>
            Logout
          </button>
        </header>

        <section className="profile-details">
          <h2>Your Profile</h2>

          <p>
            <strong>Name:</strong> {user.name}
          </p>

          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <p>
            <strong>Role:</strong> {user.role}
          </p>
        </section>

        <TournamentDashboard />

      </main>
    );
  }

  // Login and Registration UI
  return (
    <main className="auth-container">

      <section className="auth-card">

        <h1>Mini Sports Tournament</h1>

        <p className="subtitle">
          Organizer Authentication
        </p>

        <div className="auth-tabs">

          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => {
              setMode("login");
              setMessage("");
            }}
          >
            Login
          </button>

          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => {
              setMode("register");
              setMessage("");
            }}
          >
            Register
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          {mode === "register" && (
            <div className="form-group">

              <label>Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                required
                minLength={2}
              />

            </div>
          )}

          <div className="form-group">

            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={mode === "register" ? 8 : 1}
            />

          </div>

          {message && (
            <p className="message" role="alert">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "register"
                ? "Create Account"
                : "Login"}
          </button>

        </form>

        <p className="switch-text">

          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            type="button"
            className="text-button"
            onClick={() => {
              setMode(
                mode === "login" ? "register" : "login"
              );

              setMessage("");
            }}
          >
            {mode === "login" ? "Register" : "Login"}
          </button>

        </p>

      </section>

    </main>
  );
}

export default App;
