const db = require("../../persistance/src/DB_Configuration");

class Candidat extends db.Sequelize.Model {

    static init(sequelize, DataTypes) {
        return super.init(
          {
            id: {
                type: DataTypes.STRING(126).BINARY,
                primaryKey: true
            },
            title: DataTypes.STRING,
            mail: DataTypes.STRING,
            description : DataTypes.STRING
          },
          { sequelize }
        );
    }
    
    static getUniqueID()
    {
        return "ID UNIQUE";
    }

}
module.exports = Candidat;
