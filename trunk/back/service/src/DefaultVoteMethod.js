const VoteMethod = require('../../metier/src/VoteMethod')
const GroupRound = require('../../metier/src/GroupRound')
const VoteStock = require('../../metier/src/VoteStock')
const Voter = require('../../metier/src/Voter')
const Round = require('../../metier/src/Round')
const Group = require('../../metier/src/Group')
const db = require("../../persistance/src/DB_Configuration");

class AbstractVoteMethod {
    constructor() {
      if (new.target === AbstractVoteMethod) {
        throw new TypeError("Cannot construct Abstract instances directly");
      }
    }

    vote()
     {
         throw new TypeError("You have to implement the method")
     }

     calculateResult()
     {
        throw new TypeError("You have to implement the method")
     }
     static async findVotes(id,roundID)
     {
         return VoteStock.findAll({where : {
             roundID: roundID,
             voterID : id
         }})
         .then(list => {
            return list
         })
         .catch(err => console.log(err))    
     
    }

    static async addVoter(id)
    {

        let test = await Voter.findByPk(id)
        .then(v => {
            if(v == undefined)
            {
                return true;   
            }
            else 
                return false;
        })
        .catch(err => console.log(err))
        if (test)
        {
            await Voter.create({
                id : id
            })
            .then(v => v)
            .catch(err => console.log(err))
        }
    }
    static async getVoters(roundID)
    {
        let voters = await VoteStock.findAll({
            attributes: ['voterId',
                        'candidatID',
                        [db.sequelize.fn('count', db.sequelize.col('voterId')),'votes']
                    ],
            where : {
                RoundId : roundID
            },
            group: ['voterId','candidatID'],
            order: [
                [db.sequelize.fn('count', db.sequelize.col('voterId')), 'DESC'],
            ],
            
        })
        .then(Response => Response)
        .catch(err => 
            {
                console.log(err)
                return []
            })
        return voters
    }
    static async addVote(voterID , roundID , candidatID)
    {

        await AbstractVoteMethod.addVoter(voterID)
        
        return VoteStock.create({
            VoterId : voterID,
            CandidatId : candidatID,
            RoundId : roundID
        })
        .then(vote => vote)
        .catch(err => console.log(err))
    }

    static async deleteAllVotes(voterID,roundID)
    {
        let etat = await Round.findByPk(roundID).then(round=>{
            if(round != undefined)
                return round.state
            else
                return ''

        })

        if(etat!='active')
        {
            console.log("la session n'est pas active")
            return false
        }
        await VoteStock.destroy({ where: 
            { 
                VoterID: voterID,
                RoundId : roundID 
            
            }})
        return true;
    }
    static async getVoteMethodList()
    {
         return VoteMethod.findAll()
         .then(methods=>methods)
         .catch(err=>{console.log(err)})
    }
    static addVoteMethod(name , description,title)
    {
        return VoteMethod.create({
             name : name,
             description : description,
             title : title
         }).then(m=>m)
         .catch(err => console.log(err))
    }
     static async getDefaultVoteMethodID()
     {
         return VoteMethod.findOne({where : {
             name : "DefaultVoteMethod"
         }})
         .then( v => v.id)
         .catch(err => console.log(err))
     }
     static async getVoteMethodIDbyPrivateCode(privateCode,roundID)
     {
         if(privateCode != undefined)
            return GroupRound.findOne({where:{
                privateCode : privateCode,
                RoundID : roundID
            }})
            .then(async function (link ) {
                if(link==undefined)
                    return {voteMethod :"DefaultVoteMethod",group : "DefaultGroup"};
                else{
                    let groupName = await Group.findByPk(link.GroupID)
                    .then(group => group.name)
                    .catch(err => console.log(err))

                    return await VoteMethod.findByPk(link.VoteMethodID)
                    .then(method => {return{voteMethod :method.name,group : groupName}})
                    .catch(err => console.log(err))
                }
            })
            .catch(err => console.log('error : getVoteMethodIDbyVoterID()'))
        else
        {
            return {voteMethod :"DefaultVoteMethod",group : "DefaultGroup"};
        }
    }
     
}

class DefaultVoteMethod extends AbstractVoteMethod
 {
     constructor()
     {
         super()
     }
     
     async vote(voterID,candidatID,round)
     {
        let etat = await Round.findByPk(round).then(round=>{
            return round.state
        })

        if(etat!='active')
        {
            return {status : false , error : "inactive"}
        }
         if(voterID!=undefined &&candidatID!=undefined && round!=undefined){
            let votes = await AbstractVoteMethod.findVotes(voterID,round)
            if(votes != undefined && votes.length ==0)
            {
                let vote =  await AbstractVoteMethod.addVote(voterID,round,candidatID)
                return {status : true , object : vote}    
            }else
            return {status : false , error : "voted"}
         }
     }
 }
 class OtherVoteMethod extends AbstractVoteMethod
 {
     constructor()
     {
         super()
     }
     
     async vote(voterID,candidatID,round)
     {
        let etat = await Round.findByPk(round).then(round=>{
            return round.state
        })

        if(etat!='active')
        {
            return {status : false , error : "inactive"}
        }
         if(voterID!=undefined &&candidatID!=undefined && round!=undefined){
            let votes = await AbstractVoteMethod.findVotes(voterID,round)
            if(votes != undefined && votes.length ==0)
            {
                let vote1 =  await AbstractVoteMethod.addVote(voterID,round,candidatID)
                let vote2 =  await AbstractVoteMethod.addVote(voterID,round,candidatID)
                let vote3 =  await AbstractVoteMethod.addVote(voterID,round,candidatID)
                
                return {status : true , object : [vote1,vote2,vote3]}
            }else
            return {status : false , error : "voted"}
         }
     }
 }

 module.exports = {
     AbstractVoteMethod,DefaultVoteMethod,OtherVoteMethod
 }