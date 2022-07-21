const Sequelize = require("sequelize");
// foreign key ve ilişkiler app.js de tanımlanmış. burada genelde sabit elemanlar ile PK
const sequelize = require("../utility/database");

const Product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  isDeleted: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Product;
