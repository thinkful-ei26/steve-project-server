require('dotenv').config()

module.exports = {
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost/blackbrier',
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL || 'mongodb://localhost/blackbrier-test',
  JWT_SECRET: process.env.JWT_SECRET, //this doesnt have a fallback so it has to get the value assigned in the env variable

  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d'
}
