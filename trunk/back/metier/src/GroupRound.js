/*cette classe gére la relation entre Round et Group*/

const db = require("../../persistance/src/DB_Configuration");

class GroupRound extends db.Sequelize.Model  {

  static init(sequelize, DataTypes) {
    return super.init(
      {
          privateCode : DataTypes.STRING,
      },
      { sequelize }
    );
  }
  
  static makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
  

  static generatePrivateCode()
  {

    return GroupRound.makeid();
  }
}

module.exports = GroupRound;