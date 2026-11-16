
# Database Design
## Mini Sports Tournament Management System

### Database
MySQL

### ORM
Prisma ORM

### Main Models

1. User
2. Tournament
3. Team
4. Player
5. TournamentTeam
6. TournamentPlayer
7. Match
8. MatchResult
9. PlayerMatchStat

### Relationships

- One User can organize multiple Tournaments.
- One Tournament can have multiple registered Teams.
- One Team can participate in multiple Tournaments.
- One Tournament can have multiple Players.
- One Player can participate in multiple Tournaments.
- One Tournament can contain multiple Matches.
- Each Match belongs to one Tournament.
- Each Match has two participating Teams.
- Each Match can have one MatchResult.
- Each Match can have multiple PlayerMatchStats.
- Each Player can have multiple PlayerMatchStats.

### Important Constraints

- User email must be unique.
- A Team can register only once in a Tournament.
- A Player can represent only one Team in a Tournament.
- A Match can have only one Result.
- A Player can have only one statistics record per Match.

### Tournament Points

- Win: 2 points
- Tie/Draw: 1 point
- Loss: 0 points

### Database Migration

Initial migration was created using Prisma Migrate.

Command:
npx prisma migrate dev --name init
