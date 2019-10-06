/**
*Cette classe sert à definir ce qui se passe lors d'un tour;
*/
const db = require("../../persistance/src/DB_Configuration");

class Round extends db.Sequelize.Model  {

  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        pointer : DataTypes.STRING,
        roundOrder : DataTypes.INTEGER,
        numberWinners : DataTypes.INTEGER,
        startDate : DataTypes.DATE,
        endDate: DataTypes.DATE,
        state : DataTypes.STRING,
        editable : DataTypes.BOOLEAN
        },
      { sequelize }
    );
  }

}

module.exports = Round;
