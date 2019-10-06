
const DisplayMode = require("../../metier/src/DisplayMode")
const GroupRound = require("../../metier/src/GroupRound")
const Group = require("../../metier/src/Group")
const VoteStock = require('../../metier/src/VoteStock')
const db = require("../../persistance/src/DB_Configuration");

class AbstractDisplayMode {

    constructor() {
      if (new.target === AbstractDisplayMode) {
        throw new TypeError("Cannot construct Abstract instances directly");
      }
    }

    static async getDisplayModeList()
    {
        return DisplayMode.findAll()
        .then(d => d)
        .catch(err => console.log(err))
    }
    static async addDisplayMode(name,desc,title)
    {
        
        DisplayMode.create({
            name : name,
            description : desc,
            title : title
        })
    }
    static async getDefaultDisplayModeID()
    {
        return DisplayMode.findOne({where : {
            name : "DefaultDisplayMode"
        }})
        .then(d => d.id)
        .catch(err => console.log(err))
    }

    async getResult(roundId)
    {
        throw new TypeError("Cannot construct Abstract instances directly");
    }
    static async getDisplayModebyPrivateCode(privateCode,roundID)
     {
         console.log(roundID+ " " + privateCode)
         if(privateCode != undefined)
            return GroupRound.findOne({where:{
                privateCode : privateCode,
                roundID : roundID
            }})
            .then(async function (link ) {
                console.log("link : "+link.DisplayModeID)
                if(link==undefined)
                    return {displayMode :"DefaultDisplayMode",group : "DefaultGroup"};
                else{
                    let groupName = await Group.findByPk(link.GroupID)
                    .then(group => group.name)
                    .catch(err => console.log(err))

                    return await DisplayMode.findByPk(link.DisplayModeID)
                    .then(method => {return{displayMode :method.name,group : groupName}})
                    .catch(err => console.log(err))
                }
            })
            .catch(err => console.log(err))
        else
        {
            return {displayMode :"DefaultDisplayMode",group : "DefaultGroup"};
        }
    }
}

class DefaultDisplayMode extends AbstractDisplayMode{

    constructor()
    {
        super()
    }
    async getResult(roundId)
    {                                                                                                                                                                                                //and v.roundID = "+roundId+"                                         
        let results = await db.sequelize.query("select count(v.RoundId) as votes,p.CandidatID as candidat from VoteStocks v right join Participates p on (v.CandidatId = p.CandidatID and v.RoundId = p.roundID) where p.roundID = "+roundId+" and v.RoundId = "+roundId+"  group by p.roundID,p.CandidatID order by count(p.roundId) desc"
        , { type: db.sequelize.QueryTypes.SELECT})
        .then(results => {
            return results
        }).catch(err => {
            console.log(err)
            return []
        })

        let results2 = await db.sequelize.query("select count(*) as votes,p.CandidatID as candidat from  Participates p where p.roundID = "+roundId+" and p.CandidatID NOT IN (select CandidatId from VoteStocks where RoundId = "+roundId+" ) group by p.roundID,p.CandidatID order by count(*) desc"
        , { type: db.sequelize.QueryTypes.SELECT})
        .then(results => {
            return results
        })
        .catch(err => 
        {
            console.log(err)
            return []
        })
        let i = 0;
        for(;i<results2.length;i++)
            results2[i].votes=0
        results = results.concat(results2)
        
        return results
    }
}

class TOP5 extends AbstractDisplayMode{

    constructor()
    {
        super()
    }
    async getResult(roundId)
    {
        return db.sequelize.query("select count(v.roundId) as votes,p.CandidatID as candidat from VoteStocks v right join Participates p on v.CandidatId = p.CandidatID where p.roundID = "+roundId+" and v.roundID = "+roundId+" group by v.roundId,p.CandidatID order by count(v.roundId) desc LIMIT 5;"
        , { type: db.sequelize.QueryTypes.SELECT})
        .then(results => {
            return results
        })
        .catch(err => console.log(err))
    }
}
module.exports = {
    AbstractDisplayMode,DefaultDisplayMode,TOP5
}
