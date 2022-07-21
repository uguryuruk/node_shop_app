const Sequelize = require("sequelize");
require('dotenv').config();

//connection string - MYSQL veri tabanı için
const sequelize = new Sequelize("node-app", DATABASE_USER, DATABASE_PASSWORD, {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
