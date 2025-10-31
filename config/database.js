require('dotenv').config();
const { Sequelize } = require('sequelize');
const host = process.env.DB_HOST;
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;
const port = process.env.DB_PORT || 3306;  // Default MySQL port is 3306

// Create a Sequelize instance for connecting to the MySQL database
const sequelize = new Sequelize(
  database, 
  username, 
  password, {
  host: host,
  dialect: 'mysql',
  logging: false, // Disable SQL logging in the console
});

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

connectDB();

module.exports = sequelize;

