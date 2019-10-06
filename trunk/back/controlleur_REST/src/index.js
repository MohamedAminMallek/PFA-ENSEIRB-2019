'use strict;'


const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const crypto = require('crypto')

//const expressip = require('express-ip');
const Admin = require("../../metier/src/Admin")

const CreateDataBase = require('../../persistance/src/CreateDataBase');

const voteType = require('../../service/src/AbstractVoteType')
const serviceVoteMethod = require('../../service/src/DefaultVoteMethod')
const serviceDisplayMode = require('../../service/src/DisplayModeService')
const serviceCandidat = require('../../service/src/CandidatService')

// Initialisation serveur
const app = express();


//app.use(expressip().getIpInfoMiddleware);



// Sécurité
app.use(cors());

// Configuration parser body
app.use(bodyParser.json());


app.get('/',function(req,res){
 /* const ipInfo = req.ipInfo;
  res.status(200).json({"message1": "le serveur POSTEIRB est en ligne",
                         "message2" : ipInfo,
                         "ip" : req.ip    
                      
                        })
*/
res.status(200).json({"msg" : "hello"})  
})

/*  ---  Version Simple   ----  */ 

app.post('/addSession',async function(req,res){

  req.body.modeScrutin = "ClassicSystem";
  let service = eval("new voteType."+req.body.modeScrutin+"()"); 
  // faire les testes sur les params
  let sesison = await service.createSession(req.body.title,req.body.description,req.body.startDate,req.body.endDate,req.body.numberMaxCandidats)
  
  if(sesison!=undefined)
    res.status(200).json(sesison);
  else
    res.status(500).json({error : "check server console"})
  
})

app.get('/sessions',async function(req,res){

  let sessions = await voteType.AbstractVoteType.getSessions()
  if(sessions != undefined)
    res.status(200).json(sessions)
  else
    res.status(500).json({error : "check server console"})
})
app.get('/pointers',async function(req,res){
  let pointers = await voteType.AbstractVoteType.getPointers();
  res.status(200).json(pointers)
})
app.post('/addRound',async function(req,res){
  // il faut avoir l'ID de la session
  req.body.modeScrutin = "ClassicSystem";
  let service = eval("new voteType."+req.body.modeScrutin+"()"); 
  
  let round = await service.addRound(1,1,req.body.startDate,req.body.endDate,req.body.pointer,req.body.sessionID)
  
  if(round != undefined)
    res.status(200).json(round)
  else
    res.status(500).json({error : "check server console"})
})
app.post('/updateSession',async function(req,res){
  let result = await voteType.AbstractVoteType.updateSession(
    req.body.sessionID,
    req.body.title,
    req.body.startDate,
    req.body.endDate
  )
  if(result)
    res.status(200).json({message : 'Session updated'})
  else
    res.status(500).json({error : 'check server console'})
})

app.post('/updateRound',async function(req,res){
  let result = await voteType.AbstractVoteType.updateRound(
    req.body.roundID,
    req.body.pointer,
    req.body.startDate,
    req.body.endDate
  )
  if(result)
    res.status(200).json({message : 'Round updated'})
  else
    res.status(500).json({error : 'check server console'})
})

app.get('/rounds',async function(req,res){
  let rounds = await voteType.AbstractVoteType.getRounds()
  if(rounds != undefined)
    res.status(200).json(rounds)
  else
    res.status(500).json({error : "check server console"})
})

app.post('/addGroup',async function(req,res){
  
  req.body.modeScrutin = "ClassicSystem";
  let service = eval("new voteType."+req.body.modeScrutin+"()"); 
  
  let group = await service.createGroup(req.body.name)
  if(group!=undefined)
    res.status(200).json(group)
  else
    res.status(500).json({error : "check server console"})
})

app.get('/getGroupList',async function(req,res){

  req.body.modeScrutin = "ClassicSystem";
  let service = eval("new voteType."+req.body.modeScrutin+"()"); 
  
  let groups =await service.getGroups()
  if(groups!=undefined)
    res.status(200).json(groups)
  else
    res.status(500).json({error : "check server console"})
})

app.post('/deleteGroup',async function(req,res){
  let groupID = req.body.groupID
  req.body.modeScrutin = "ClassicSystem";
  let service = eval("new voteType."+req.body.modeScrutin+"()"); 
  
  let test =await service.deleteGroup(groupID)
  if(test)
    res.status(200).json(test)
  else
    res.status(500)
})

app.post('/addDisplayMode', async function(req,res){

  serviceDisplayMode.AbstractDisplayMode.addDisplayMode(req.body.name,req.body.description,req.body.title)
  res.send('OK')

})

app.get('/getDisplayModeList',async function(req,res){
  
  let list = await serviceDisplayMode.AbstractDisplayMode.getDisplayModeList()
  res.send(list)

})
app.post('/addVoteMethod',async function(req,res){
  let m = serviceVoteMethod.AbstractVoteMethod.addVoteMethod(req.body.name,req.body.description,req.body.title)
  res.send(m)
})
app.get('/getVoteMethodList',async function(req,res){
  
  let list =await serviceVoteMethod.AbstractVoteMethod.getVoteMethodList()
  if (list != undefined)
    res.status(200).json(list)
  else
    res.status(500).json({error : "check server console"})
})

//linker Group Round DisplayMode VoteMethod
app.post('/linkGroupRound',async function(req,res){
  
  let private = req.body.privateCode
  let groupID = req.body.groupID
  let roundID = req.body.roundID
  let displayModeID = req.body.displayModeID==undefined?await serviceDisplayMode.AbstractDisplayMode.getDefaultDisplayModeID():req.body.displayModeID
  let voteMethodID = req.body.voteMethodID==undefined?await serviceVoteMethod.AbstractVoteMethod.getDefaultVoteMethodID():req.body.voteMethodID



  
  req.body.modeScrutin = "ClassicSystem";
  let service = eval("new voteType."+req.body.modeScrutin+"()"); 
  let link = await service.linkGroupRound(groupID,roundID,voteMethodID,displayModeID,private)
  if(link == undefined)
  res.status(200).json({message : "check server console",error : true})
  else
  res.status(200).json({message : link,error : false})

  })

app.post('/getLinks',async function(req,res){

  let roundID  = req.body.roundID
  req.body.modeScrutin = "ClassicSystem";
  let service = eval("new voteType."+req.body.modeScrutin+"()");
  let links = await service.getLinks(roundID)

  res.status(200).json({links})

})

app.post('/addCandidat',async function(req,res){
  /*let c = await serviceCandidat.CandidatService.saveCandidat(req.body.id,
                            req.body.title,req.body.mail,req.body.description)
  res.send(c);*/
})

app.post('/linkCandidatRound',function(req,res){
  
})

app.post('/vote',async function(req,res){
  
let candidatID = req.body.candidatID;
let pointer = req.body.pointer;
let privateCode = req.body.privateCode;
let voterID = req.body.voterID;
let title = req.body.title


if(candidatID==undefined || pointer==undefined || voterID==undefined)
{
  res.status(500).json({error : 'need more data'})
}

let round = await serviceCandidat.CandidatService.getRoundByPointer(pointer)

if(round == undefined){
  res.status(200).json({message : false,err : 'check you pointer'})
  return 0;
}

let check = await serviceCandidat.CandidatService.getRoundIDByPointerAndCandidatID(
  candidatID,pointer)

  if(check == undefined)
  {
    let candidat = await serviceCandidat.CandidatService.findCandidatByID(candidatID);

    if(candidat == undefined)
    {
      await serviceCandidat.CandidatService.saveCandidat(candidatID,title,candidatID,"")
    }
    await serviceCandidat.CandidatService.addParticipate(candidatID,round.id,pointer)
  }
  
  let temp = await serviceVoteMethod.AbstractVoteMethod.getVoteMethodIDbyPrivateCode(privateCode,round.id);
  let voteMethode = temp.voteMethod
  let voteMethodeService  = eval("new serviceVoteMethod."+voteMethode+"()");
  

  let result = await voteMethodeService.vote(voterID,candidatID,round.id);
  
  if (result.status){
    res.status(200).json({message : result.status,group : temp.group})
  }
  else
    res.status(200).json({message : result.status,error : result.error,group : undefined})
})
app.post('/changeRoundState',async function(req,res){

  let r = await voteType.AbstractVoteType.changeStateRound(req.body.roundID,req.body.state)
  if(r)
    res.status(200).json({message: "c'est bon",error : false})
  else
    res.status(500).json({error : true , message: "check server console"})
})
app.post('/getResultsAdmin',async function(req,res){
  
  let service = new serviceDisplayMode.DefaultDisplayMode()
  res.status(200).json(await service.getResult(req.body.roundID))

})
app.post('/archiveRound',async function(req,res){
  
  let service = new serviceDisplayMode.DefaultDisplayMode()
  results = await service.getResult(req.body.roundID);
  await voteType.AbstractVoteType.archiverRound(req.body.roundID)
  res.status(200).json(results)

})
app.post('/deleteRound',async function(req,res){
  
  await voteType.AbstractVoteType.supprimerRound(req.body.roundID)
  res.status(200).json({message : 'round deleted'})

})
app.post('/getCandidatsByRound', async function(req,res){
  let candidat = await serviceCandidat.CandidatService.getCandidatsByRound(req.body.roundID)
  res.status(200).json(candidat)
})
app.post('/deleteCandidat',async function(req,res){

  let candidatID = req.body.candidatID
  let roundID = req.body.roundID

  await serviceCandidat.CandidatService.deleteCandidat(candidatID,roundID)
  res.status(200).json({message : 'done'})
})

app.post('/getVoters',async function(req,res){
  let roundID = req.body.roundID
  if(roundID==undefined)
    res.status(500).json([])

  let voters = await serviceVoteMethod.AbstractVoteMethod.getVoters(roundID)
  res.status(200).json(voters)
})
app.post('/deleteVoter',async function(req,res){
  let roundID = req.body.roundID
  let voterId = req.body.voterId
  if(roundID == undefined || voterId == undefined)
    res.status(500)

  let check = await serviceVoteMethod.AbstractVoteMethod.deleteAllVotes(voterId,roundID)
  if(check)
    res.status(200).json({message : 'true'})
  else
    res.status(200).json({message : 'no'})

})

app.post('/deleteVote',async function(req,res){



  let candidatID = req.body.candidatID;
  let pointer = req.body.pointer;

  
  let roundID = await serviceCandidat.CandidatService.getRoundIDByPointerAndCandidatID(
    candidatID,pointer)  

  let check = await serviceVoteMethod.AbstractVoteMethod.deleteAllVotes(req.body.voterID,roundID)
  if(check)
    res.status(200).json({message : 'true'})
  else
    res.status(200).json({message : 'no'})
})

app.post('/removeLink',async function(req,res){
  
  let idLink = req.body.linkID
  req.body.modeScrutin = "ClassicSystem";
  let service = eval("new voteType."+req.body.modeScrutin+"()");
  await service.removeLink(idLink)
  res.status(200).json({message : "done"})
})

app.post('/getResults',async function(req,res){
  
  let privateCode = req.body.privateCode
  let pointer = req.body.pointer
  let candidatID = req.body.candidatID

  let round = await serviceCandidat.CandidatService.getRoundByPointer(pointer)

  if(round == undefined){
    res.status(200).json({message : false,err : 'check you pointer'})
    return 0;
  }

  let roundID = await serviceCandidat.CandidatService.getRoundIDByPointerAndCandidatID(candidatID,pointer)
  if(roundID==undefined)
  {
    res.status(200).json([])
  }
  let temp = await serviceDisplayMode.AbstractDisplayMode.getDisplayModebyPrivateCode(privateCode,roundID);
  if(temp==undefined)
  {
    res.status(200).json([])
  }
  let displayMode = temp.displayMode
  let displayModeInstace  = eval("new serviceDisplayMode."+displayMode+"()");
  let results = await displayModeInstace.getResult(roundID)
  res.status(200).json(results)

})
app.post('/getDisplayMode',async function(req,res){

  let privateCode = req.body.privateCode
  let pointer = req.body.pointer
  let candidatID = req.body.candidatID

  let round = await serviceCandidat.CandidatService.getRoundByPointer(pointer)

  if(round == undefined){
    res.status(200).json({message : false,err : 'check you pointer'})
    return 0;
  }

  let roundID = await serviceCandidat.CandidatService.getRoundIDByPointerAndCandidatID(candidatID,pointer)
  let temp = await serviceDisplayMode.AbstractDisplayMode.getDisplayModebyPrivateCode(privateCode,roundID);
  let displayMode = temp.displayMode
  
  res.status(200).json({mode : displayMode})

})

/* --- fin de la version Simple --- */

app.get('/addAdmin',function(req,res){
  
  Admin.create({
    username : 'admin',
    password : 'admin'
  })
  
  res.status(200).json({message : 'ok'})
})

app.post('/login',async function(req,res){

  let login = await Admin.findOne({
    where : {
      username : req.body.username,
      password : req.body.password
    }
  })
  .then(async function (auth){
    if (auth == undefined)
    { // handling cookie
      let cookie = await Admin.findOne({
        where: {
          cookie : req.body.authcookie
        }
      }).then(cook => {
        if (cook == undefined)
        {
          return false
        } else 
        if (cook.expiration < new Date) 
        {
          return false
        } else {
          return true
        }
      })
      .catch(err => {
        return false
      })
      return {valid: cookie, cookie: undefined}
    } else { //connexion success without use of cookie
      var id = crypto.randomBytes(20).toString('hex');
      //TODO : add cookie in table
      var exp = new Date();
      exp.setHours(exp.getHours() + 2);
      auth.update({
        cookie: id,
        expiration: exp
      })

      return {valid: true, cookie: id}
    }
  }).catch(err => {
    return {valid: false, cookie: undefined}
  })
  res.status(201).json(login)

})



CreateDataBase.createTables();


/* Démarrage serveur */
app.listen(3001, function () {
    console.log('Serveur posteirb démarré !');
  });
