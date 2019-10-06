const Round = require('../../metier/src/Round')
const Candidat = require('../../metier/src/Candidat')
const Participate = require('../../metier/src/Participate')
const VoteStock =  require('../../metier/src/VoteStock')
const Session = require('../../metier/src/Session')

class CandidatService {

    static async findCandidatByID(id)
    {
        let result = undefined;
        result =await Candidat.findByPk(id)
        .then(candidat => {
            if(candidat != undefined)
                return candidat.dataValues;
            else
                return result;
        })
        .catch(err => console.log('error : findCandidatByID'))
        return result;
    }
    static async deleteCandidat(id,roundID)
    {
        await VoteStock.destroy({ where: 
            { 
                CandidatId: id,
                RoundId : roundID 
            }
        })
        await Participate.destroy({ 
            where: { candidatID: id,roundID : roundID }
        })
        let test = await Participate.findAll(
            {
                where : {candidatID : id}
            }
        ).then(res => {
            if(res == undefined)
            return true
            else
            return false
        })
        if(test)
        await Candidat.destroy({ where: { id: id }})
    }
    static async getCandidatsByRound(roundId)
    {
        return await Participate.findAll({
            where : {roundID : roundId},
            attributes : ['candidatID']
        })
        .then(res => res)
        .catch(err => console.log(err))
    }
    static async saveCandidat(id,title,mail,description)
    {
        return await Candidat.create(
            {
                    id : id,
                    title : title,
                    mail : mail,
                    description : description
            }).then((candidat)=>{
                if(candidat != undefined)
                    return candidat.dataValues;
            })
            .catch((err)=>{
                console.log("Error : saveCandidat()")
            })
    }

    static async getRoundByPointer(pointer)
    {
        return Round.findOne({where : {
            pointer : pointer
        }})
        .then(round => {
            if(round != undefined)
                return round
            else
                return undefined
        })
        .catch(err => console.log(err))
    }

    static async getRoundIDByPointerAndCandidatID(candidatID,pointer)
    {
        return Participate.findOne({where : {
            pointer : pointer,
            candidatID : candidatID
        }})
        .then(p =>{
            if(p != undefined)
                return p.roundID
            else
                undefined
        })
        .catch(err => console.log(err))
    }

    static async addParticipate(candidatID, roundID , pointer)
    {
        return Participate.create({
            candidatID : candidatID,
            roundID : roundID,
            pointer : pointer
        })
        .then(p =>p)
        .catch(err => console.log(err))
    }


    


}



  module.exports = {
      CandidatService
  }
