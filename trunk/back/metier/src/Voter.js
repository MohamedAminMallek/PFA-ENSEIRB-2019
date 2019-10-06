/**
* Cette classe sert à creer des votants
*/
const db = require("../../persistance/src/DB_Configuration");
class Voter extends db.Sequelize.Model {

  
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          type: DataTypes.STRING(126).BINARY,
          primaryKey: true
        }
      },
      { sequelize }
    );
  }
}

module.exports = Voter;
