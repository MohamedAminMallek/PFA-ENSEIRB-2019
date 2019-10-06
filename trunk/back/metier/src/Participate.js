/**
*Cette class sert à definir l'association Many to Many entre Candidat , Tour ( round)
*/
const db = require("../../persistance/src/DB_Configuration");
class Participate extends db.Sequelize.Model {


  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        roundID : DataTypes.INTEGER,
        candidatID : DataTypes.STRING(126).BINARY,
        pointer : DataTypes.STRING
      },
      { sequelize }
    );
  }
}

module.exports = Participate;
