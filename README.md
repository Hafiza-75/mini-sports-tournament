# Mini Sports Tournament Management System

## Project Overview

A full-stack web application for managing cricket tournaments. Organizers can create and manage tournaments, while public visitors can view published tournaments.

## Technology Stack

**Frontend**
- React.js
- Vite
- CSS

**Backend**
- Node.js
- Express.js
- Prisma ORM
- JWT Authentication
- bcryptjs
- Zod Validation

**Database**
- MySQL

## Project Structure

```text
mini-sports-tournament/
├── frontend/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       └── validators/
├── docs/
├── .gitignore
└── README.md
```

## Features Implemented – Day 1

- React frontend setup
- Express backend setup
- MySQL database connection
- Prisma ORM configuration
- Database schema and initial migration
- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Protected routes and role authorization
- Tournament creation
- Tournament listing
- Tournament details
- Tournament updating
- Tournament deletion
- Input validation and error handling
- Organizer ownership verification

## Database Models

1. User
2. Tournament
3. Team
4. Player
5. TournamentTeam
6. TournamentPlayer
7. Match
8. MatchResult
9. PlayerMatchStat

## Backend API Endpoints

### Authentication

| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/profile | Authenticated |

### Tournaments

| Method | Endpoint | Access |
|---|---|---|
| POST | /api/tournaments | Organizer |
| GET | /api/tournaments | Public |
| GET | /api/tournaments/:id | Public |
| PUT | /api/tournaments/:id | Organizer/Owner |
| DELETE | /api/tournaments/:id | Organizer/Owner |

## Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd mini-sports-tournament
```

Install backend dependencies:

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder using `.env.example` as a reference.

Run migrations and generate Prisma Client:

```bash
npx prisma migrate dev
npx prisma generate
```

Start backend:

```bash
npm run dev
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

Start frontend:

```bash
npm run dev
```

## Environment Variables

Configure these in `backend/.env`:

- DATABASE_URL
- JWT_SECRET
- JWT_EXPIRES_IN
- PORT
- NODE_ENV

Never commit your actual `.env` file.

## Testing

Authentication and tournament APIs were tested using Postman.

Frontend and backend were tested locally.

## Project Status

Day 1: Project setup, database design, authentication, and tournament CRUD.

Upcoming:
- Day 2: Teams, players, and registrations.
- Day 3: Fixtures and scheduling.
- Day 4: Match results, points table, and leaderboards.
- Day 5: Final frontend integration, testing, and documentation.