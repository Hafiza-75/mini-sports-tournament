
function generateRoundRobinFixtures(teams) {
  if (!Array.isArray(teams) || teams.length < 2) {
    throw new Error("At least 2 teams are required to generate fixtures");
  }

  // Team IDs must be unique
  const teamIds = teams.map((team) => team.id);

  if (new Set(teamIds).size !== teamIds.length) {
    throw new Error("Duplicate team IDs are not allowed");
  }

  // Copy teams to avoid modifying original array
  const list = [...teams];

  // Odd number of teams: add virtual BYE
  if (list.length % 2 !== 0) {
    list.push({ id: null, name: "BYE" });
  }

  const totalTeams = list.length;
  const totalRounds = totalTeams - 1;
  const matchesPerRound = totalTeams / 2;

  const fixtures = [];
  let rotatingTeams = [...list];

  for (let round = 1; round <= totalRounds; round++) {
    for (let match = 0; match < matchesPerRound; match++) {
      const home = rotatingTeams[match];
      const away = rotatingTeams[totalTeams - 1 - match];

      // Skip BYE matches
      if (home.id === null || away.id === null) {
        continue;
      }

      fixtures.push({
        homeTeamId: home.id,
        awayTeamId: away.id,
        round
      });
    }

    // Keep first team fixed, rotate remaining teams
    const fixed = rotatingTeams[0];
    const remaining = rotatingTeams.slice(1);

    remaining.unshift(remaining.pop());

    rotatingTeams = [fixed, ...remaining];
  }

  return fixtures;
}

module.exports = generateRoundRobinFixtures;
