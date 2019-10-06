/**
*cette classe gère l'affichage à la fin d'un tour/fin de session
*/
const db = require("../../persistance/src/DB_Configuration");

class DisplayModeData1 extends db.Sequelize.Model  {

  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        numberToDisplay : DataTypes.INTEGER,
        displayMode : DataTypes.STRING,
        displayVotes : DataTypes.BOOLEAN,
        displayRolePage : DataTypes.BOOLEAN
      },
      { sequelize }
    );
  }

  constructor(numberToDisplay,displayMode,displayVotes,displayRolePage) {
    super();
    this.numberToDisplay = numberToDisplay;
    this.displayMode = displayMode;
    this.displayVotes = displayVotes;
    this.displayRolePage = displayRolePage;
  }
  getID()
  {
    return this.id;
  }
  getNbGagnant(){
    return this.nbGagnant;
  }

  getNbAffiche(){
    return this.nbAffiche;
  }

  gettypeAff(){
    return this.typeAff;
  }

}

module.exports = DisplayModeData1;
