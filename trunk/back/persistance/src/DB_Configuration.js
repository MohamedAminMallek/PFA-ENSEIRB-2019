const Sequelize = require("sequelize");

const sequelize = new Sequelize('posteirb', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    operatorsAliases: false
});

var db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;