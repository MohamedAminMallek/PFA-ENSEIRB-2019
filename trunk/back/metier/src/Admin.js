const db = require("../../persistance/src/DB_Configuration");

class Admin extends db.Sequelize.Model {

    static init(sequelize, DataTypes) {
        return super.init(
          {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            username: DataTypes.STRING,
            password: DataTypes.STRING,
            cookie: DataTypes.STRING,
            expiration: DataTypes.DATE
          },
          { sequelize }
        );
    }
}
module.exports = Admin;
