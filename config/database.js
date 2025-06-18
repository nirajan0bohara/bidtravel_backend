// const Sequelize = require('sequelize');
// const dotenv = require("dotenv");
// dotenv.config();
// const DB = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//     dialect: 'mysql',
//     host: process.env.DB_HOST,
// })
// module.exports = DB;

const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

module.exports = { sequelize };