const db = require("./DB_Configuration");

const Candidat = require("../../metier/src/Candidat");
const Group = require("../../metier/src/Group");
const Round = require("../../metier/src/Round");
const Voter = require("../../metier/src/Voter");
const Session = require("../../metier/src/Session");
const VoteStock = require("../../metier/src/VoteStock")
const Participate = require("../../metier/src/Participate")
const GroupRound = require('../../metier/src/GroupRound')
const DisplayMode = require('../../metier/src/DisplayMode')
const VoteMethod = require('../../metier/src/VoteMethod')
const Admin = require('../../metier/src/Admin')

const models = {
    Candidat: Candidat.init(db.sequelize, db.Sequelize),
    Round: Round.init(db.sequelize, db.Sequelize),
    Group: Group.init(db.sequelize, db.Sequelize),
    Voter: Voter.init(db.sequelize, db.Sequelize),
    Session : Session.init(db.sequelize, db.Sequelize),
    VoteStock : VoteStock.init(db.sequelize, db.Sequelize),
    Participate : Participate.init(db.sequelize, db.Sequelize),
    GroupRound : GroupRound.init(db.sequelize, db.Sequelize),
    DisplayMode : DisplayMode.init(db.sequelize, db.Sequelize),
    VoteMethod : VoteMethod.init(db.sequelize, db.Sequelize),
    Admin : Admin.init(db.sequelize, db.Sequelize),
        
};

module.exports = {  

createTables()
{
      
    // association entre Session et Round
    Round.belongsTo(Session,{foreignKey: 'sessionID'})

    //les résultats d'un round
    VoteStock.belongsTo(Round)
    VoteStock.belongsTo(Candidat)
    VoteStock.belongsTo(Voter)

    // la liaison entre Candidat Round
    Participate.belongsTo(Round,{foreignKey : 'roundID'})
    Participate.belongsTo(Candidat,{foreignKey : 'candidatID'})
    
    //association 1:n entre votant et role
    Voter.belongsTo(Group);
    

    

    //
    GroupRound.belongsTo(Round , {foreignKey : 'RoundID'})
    GroupRound.belongsTo(VoteMethod , {foreignKey : 'VoteMethodID'})
    GroupRound.belongsTo(Group , {foreignKey : 'GroupID'})
    GroupRound.belongsTo(DisplayMode , {foreignKey : 'DisplayModeID'})

    
    
    db.sequelize.sync(models);
}
};

