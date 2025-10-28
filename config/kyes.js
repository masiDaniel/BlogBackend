require("dotenv").config();

module.exports = {
  connectionUrl: process.env.CONNECTION_URL,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
};