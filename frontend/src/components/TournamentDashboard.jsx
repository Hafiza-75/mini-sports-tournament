import { useEffect, useState } from "react";

import {
  getTournaments,
  createTournament,
  updateTournament,
  deleteTournament,
} from "../services/tournamentService";
import "./TournamentDashboard.css";

function TournamentDashboard() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    maxTeams: 8,
    format: "LEAGUE",
    status: "DRAFT",
  };

  const [form, setForm] = useState(initialForm);

  const loadTournaments = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getTournaments();
      setTournaments(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTournaments();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setMessage("");

      const payload = {
        ...form,
        maxTeams: Number(form.maxTeams),
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
      };

      if (editingId) {
        await updateTournament(editingId, payload);
        setMessage("Tournament updated successfully!");
      } else {
        await createTournament(payload);
        setMessage("Tournament created successfully!");
      }

      setForm(initialForm);
      setEditingId(null);

      await loadTournaments();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (tournament) => {
    setEditingId(tournament.id);

    setForm({
      name: tournament.name,
      description: tournament.description || "",
      startDate: new Date(tournament.startDate)
        .toISOString()
        .slice(0, 16),
      endDate: new Date(tournament.endDate)
        .toISOString()
        .slice(0, 16),
      maxTeams: tournament.maxTeams,
      format: tournament.format,
      status: tournament.status,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this tournament?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await deleteTournament(id);
      setMessage("Tournament deleted successfully!");

      await loadTournaments();
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  return (
    <main className="tournament-dashboard">
      <header className="dashboard-heading">
        <div>
          <h1>Tournament Management</h1>
          <p>Create and manage your cricket tournaments.</p>
        </div>

        <button onClick={loadTournaments}>
          Refresh
        </button>
      </header>

      <section className="tournament-form-section">
        <h2>
          {editingId ? "Update Tournament" : "Create Tournament"}
        </h2>

        <form onSubmit={handleSubmit} className="tournament-form">
          <label>
            Tournament Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              minLength={3}
              placeholder="Summer Cricket Cup"
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Tournament details..."
            />
          </label>

          <label>
            Start Date
            <input
              type="datetime-local"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            End Date
            <input
              type="datetime-local"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Maximum Teams
            <input
              type="number"
              name="maxTeams"
              value={form.maxTeams}
              onChange={handleChange}
              min="2"
              required
            />
          </label>

          <label>
            Format
            <select
              name="format"
              value={form.format}
              onChange={handleChange}
            >
              <option value="LEAGUE">League</option>
            </select>
          </label>

          <label>
            Status
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="DRAFT">Draft</option>
              <option value="REGISTRATION_OPEN">Registration Open</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </label>

          <div className="form-actions">
            <button type="submit">
              {editingId ? "Update Tournament" : "Create Tournament"}
            </button>

            {editingId && (
              <button type="button" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {error && <p className="dashboard-error">{error}</p>}
      {message && <p className="dashboard-success">{message}</p>}

      <section className="tournament-list-section">
        <h2>Public Tournaments</h2>

        {loading ? (
          <p>Loading tournaments...</p>
        ) : tournaments.length === 0 ? (
          <p>No published tournaments available.</p>
        ) : (
          <div className="tournament-grid">
            {tournaments.map((tournament) => (
              <article
                className="tournament-card"
                key={tournament.id}
              >
                <h3>{tournament.name}</h3>

                <p>{tournament.description}</p>

                <p>
                  <strong>Status:</strong> {tournament.status}
                </p>

                <p>
                  <strong>Maximum Teams:</strong> {tournament.maxTeams}
                </p>

                <p>
                  <strong>Format:</strong> {tournament.format}
                </p>

                <div className="card-actions">
                  <button onClick={() => handleEdit(tournament)}>
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(tournament.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default TournamentDashboard;
