/*cette classes gère les resulats*/

const db = require("../../persistance/src/DB_Configuration");

class VoteStock extends db.Sequelize.Model  {

  static init(sequelize, DataTypes) {
    return super.init(
      {
        //ordreVote : DataTypes.INTEGER
      },
      { sequelize }
    );
  }

}

module.exports = VoteStock;
