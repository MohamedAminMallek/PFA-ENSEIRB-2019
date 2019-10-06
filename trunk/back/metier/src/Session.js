/**
  * Class Session
  *
  */
const db = require("../../persistance/src/DB_Configuration");
class Session extends db.Sequelize.Model {

  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        startDate: DataTypes.DATE,
        endDate: DataTypes.DATE,
        state: DataTypes.STRING,
        numberMaxCandidats: DataTypes.INTEGER,
        modeScrutin : DataTypes.STRING
      },
      { sequelize }
    );
  }
  
  //constructor(/*title,description,startDate,endDate,nb,mode*/){
    //super();
    /*
    if(typeof title != 'string'){
      throw 'In Session constructor : title (first parameter) is not a number';
    }*/
    //this.title = title;
    /*
    if(typeof description != 'string'){
      throw 'In Session constructor : description (second parameter) is not a number';
    }*/
    //this.description = description;

    //this.startDate = startDate;
    //this.endDate = endDate;

    //this.state = 'created';
    /*
    if(typeof nb != 'number'){
      throw 'In Session constructor : nb (fith parameter) is not a number';
    }
    if(Math.floor(nb) != nb){
      throw 'In Session constructor : nb (fith parameter) is not a whole number';
    }
    if(nb <= 0){
      throw 'In Session constructor : nb (fith parameter) is negativ or null';
    }*/
    //this.numberMaxCandidats = nb;
    //this.modeScrutin = mode;
  //}
    /*
    getIdSession(){
      return idSession;
    }

    setIdSession(idSession){
      this.idSession = idSession;
    }

    getName(){
      return name;
    }

    setName(name){
      this.name = name;
    }

    getDescription(){
      return description;
    }

    setDescription(description){
      this.description = description;
    }

    getStartDate(){
      return startDate;
    }

    setStartDate(startDate){
      this.startDate = startDate;
    }

    getEndDate(){
      return endDate;
    }

    setEndDate(startDate){
      this.endDate = endDate;
    }

    getState(){
      return state;
    }

    setState(state){
      this.state = state;
    }*/
}
module.exports = Session;
