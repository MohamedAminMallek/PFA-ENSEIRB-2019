/*cette classe contient la liste des modes d'affiichage*/

const db = require("../../persistance/src/DB_Configuration");

class DisplayMode extends db.Sequelize.Model  {

  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
      },
      name : DataTypes.STRING,
      title : DataTypes.STRING,
      description : DataTypes.STRING,
      },
      { sequelize }
    );
  }

}

module.exports = DisplayMode;