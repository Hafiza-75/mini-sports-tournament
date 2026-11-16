
require("dotenv").config();

const prisma = require("./src/config/prisma");

async function testDatabase() {
  try {
    await prisma.$connect();

    const result = await prisma.$queryRaw`SELECT 1 AS connected`;

    console.log("Database connected successfully!");
    console.log(result);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
