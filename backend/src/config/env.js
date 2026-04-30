const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || "motomanager-dev-secret",
  databaseUrl: process.env.DATABASE_URL || "",
};
