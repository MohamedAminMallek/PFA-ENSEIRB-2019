/**
* Cette classe sert à representé les differentes catégories de votant
*/
const db = require("../../persistance/src/DB_Configuration");

class Group extends db.Sequelize.Model {


  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING,
        //weight : DataTypes.STRING,
        //numberVoteMax : DataTypes.INTEGER
      },
      { sequelize }
    );
  }

  /*
  constructor(id,nom,poidVote) {
    if(typeof id != 'number'){
      throw 'In Role constructor : id (first parameter) is not a number';
    }
    if(Math.floor(id) != id){
      throw 'In Role constructor : id (first parameter) is not a whole number';
    }
    if(id <= 0){
      throw 'In Role constructor : id (first parameter) is negativ or null';
    }
    this.id = id;

    if(typeof nom != 'string'){
      throw 'In Role constructor : nom (second parameter) is not a string';
    }
    this.nom = nom;

    if(typeof poidVote != 'number'){
      throw 'In Role constructor : poidVote (third parameter) is not a number';
    }
    this.poidVote = poidVote;
  }
*/
  getId(){
    return this.id;
  }

  getNom(){
    return this.nom;
  }

  getPoidVote(){
    return this.poidVote;
  }

}

module.exports = Group;
