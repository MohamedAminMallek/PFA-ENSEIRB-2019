const Session = require('../../metier/src/Session')
const Round = require('../../metier/src/Round')
const Group = require('../../metier/src/Group')
const GroupRound = require('../../metier/src/GroupRound')
const VoteStock = require('../../metier/src/VoteStock')
const Participate = require('../../metier/src/Participate')
class AbstractVoteType {
    constructor() {
      if (new.target === AbstractVoteType) {
        throw new TypeError("Cannot construct Abstract instances directly");
      }
    }

    initSystem(title,description,startDate,endDate,nb)
    {
        throw new Error('You have to implement the method init System');
    }
    static async getSessions()
    {
        return Session.findAll()
        .then(sessions => sessions)
        .catch(err => console.log(err))
    }
    static async getPointers()
    {
        let pointers = await Round.findAll({
            attributes: ['pointer']
        })
        .then(Response => Response)
        .catch(err => {
            console.log(err)
            return []
        })
        return pointers
    }
    static async getRounds()
    {
        return Round.findAll({include: [Session]})
        .then(rounds => rounds)
        .catch(err => console.log(err))
    }
    static async changeStateRound(roundID,state)
    {
        return await Round.findByPk(roundID)
        .then(round =>{
            round.state = state
            round.editable = false
            return round.save({fields: ['state','editable']}).then(() => {
                console.log("round updated")
                return true
            })
            .catch(err=>{
                console.log(err)
                return false
            })
        })
    }
    static async updateSession(sessionID , title , startDate, endDate)
    {
        return await Session.findByPk(sessionID)
        .then(session => {
            
            if(session == undefined)
                return false
            
            session.title = title,
            session.startDate = startDate,
            session.endDate = endDate
            
            return session.save({fields : ['title','startDate','endDate']}).then(()=>{
                return true
            })
            .catch(err => {
                console.log(err)
                return false
            })
        })
        .catch(err => {
            console.log(err)
            return false
        })
    }
    static async updateRound(roundID ,pointer,startDate, endDate)
    {
        return await Round.findByPk(roundID)
        .then(round => {
            
            if(round == undefined)
                return false
            
            round.pointer = pointer,
            round.startDate = startDate,
            round.endDate = endDate
            
            return round.save({fields : ['pointer','startDate','endDate']}).then(()=>{
                return true
            })
            .catch(err => {
                console.log(err)
                return false
            })
        })
        .catch(err => {
            console.log(err)
            return false
        })
    }
    static async archiverRound(roundId)
    {

        await VoteStock.destroy({ where: { RoundId: roundId }})
        await GroupRound.destroy({ where: { RoundID: roundId }})
        await Participate.destroy({ where: { roundID: roundId }})
        await this.changeStateRound(roundId,'archived')
    }

    static async supprimerRound(roundId)
    {
        await this.archiverRound(roundId)
        let round = await Round.findByPk(roundId)
            .then(round => round)
            .catch(err => console.log(err))
        await Round.destroy({where:{id : roundId}})
        await Session.destroy({where:{id : round.sessionID}})
    }   


  }
  
  class ClassicSystem extends AbstractVoteType {
    
    constructor() {
        
        super();
    }
    
    async createSession(title,description,startDate,endDate,nb)
    {
        let s = {
            startDate : startDate,
            endDate : endDate,
            state : 'inactive',
            numberMaxCandidats : nb,
            modeScrutin : "ClassicSystem",
            title: title,
            description: description
            
        }
        return await Session.create(s).then((s)=>s)
    }
    
    async addRound(roundOrder,numberWinners,startDate,endDate,pointer,sessionID)
    {
        let s = await Session.findByPk(sessionID)
        .then(s =>{
            if(s == undefined)
            return undefined
            else
            return s
        })
        .catch(err => {
            console.log(err)
            return undefined
        })
        if(s==undefined)
            return undefined
        let r = {
            roundOrder : roundOrder,
            numberWinners : numberWinners,
            startDate : startDate,
            endDate : endDate,
            sessionID : sessionID,
            pointer : pointer,
            state : 'inactive',
            editable : true
        }
        return Round.create(r).then(r=>r)
        .catch(err => {console.log(err)
                        return undefined})
    }
    async createGroup(name)
    {

        let g = await Group.findOne({
            where : {
                name : name
            }
        })
        .then(g => g)
        .catch(err => {
            console.log(err)
        })
        
        if(g!=undefined)
            return g

        let group = {
            name : name
        }
        return await Group.create(group).then(g => g)
    }
    async getGroups()
    {
        let groups = new Array();
        let array = await Group.findAll()
        .catch(err=>console.log(err))
        let i
        for(i=0;i<array.length;i++)
        {
            let nb = await GroupRound.findAll({
                where : {GroupID : array[i].id}
            })
            .then(res => (res != undefined)?res.length:0)
            .catch(res=> {
                console.log(err)
                return 0
            })
            groups.push({id : array[i].id ,name : array[i].name,links : nb })
        }
        return groups
    }
    async deleteGroup(groupID)
    {
        return await Group.destroy({where : {id : groupID} })
        .then(res=> true)
        .catch(err =>{
            console.log(err)
            return false
        })
    }
    async checkLink(groupID,roundID)
    {
        return GroupRound.findOne({
        where : 
        {
            GroupID : groupID,
            RoundID : roundID
        }})
        .then(link => {

            if(link == undefined)
                return true;
            else
                return false;
        })
        .catch(err => console.log(err))
    }

    async getLinks(roundID)
    {
        let links = await GroupRound.findAll({
            where : {
                RoundID : roundID
            }
        })
        .then(results => results)
        .catch(err => {
            console.log(err)
        })
        return links
    }
    async removeLink(linkID)
    {
        await GroupRound.destroy({where:{id : linkID}}).catch(err=>console.log(err))
    }
    async linkGroupRound(groupID,roundID,voteMethodID,displayModeID,privateCode)
    {
        let code = privateCode//GroupRound.generatePrivateCode();
        
        let test = await GroupRound.findOne({
            where : {
                privateCode : code,
                roundID : roundID
            }
        })
        .then(e => {
            if (e == undefined)
            return true
            else
            return false
        })
        
        if(!test)
        {
            console.log("duplicated")
            return undefined
        }
        
        test = await this.checkLink(groupID,roundID)
        if(!test)
        {
            return undefined;
        }
            
        return GroupRound.create({
            privateCode : code,
            RoundID : roundID,
            VoteMethodID : voteMethodID,
            GroupID : groupID,
            DisplayModeID : displayModeID
        })
        .then(link => link)
        .catch(err=>{console.log(err)})
    }

  }

  module.exports = {
      AbstractVoteType,ClassicSystem
  }
  