const express = require('express');
const router = express.Router();
const Candidate = require('./../models/candidate')
const User = require('./../models/user')
const {jwtAuthMiddleware,generateToken} = require('./../jwt');


const checkAdminRole = async(userID)=>{
    try{
      const user = await User.findById(userID);
      if(user.role==='admin')
       return true;
      else 
      return false;
    }
    catch(err){
      return false;
    }
}

router.post('/',jwtAuthMiddleware,async(req,res)=>{
    try{
      
      if(await checkAdminRole(req.user.id))
      {   
         
          return res.status(403).json({message: 'user has no admin role'});
      }
     const data = req.body
     const newCandidate = new Candidate(data);
    
     const  response = await newCandidate.save();
     console.log('data saved')
     res.status(200).json({response: response});
 
    }catch(err)
    {
      console.log(err);
      res.status(500).json({error: 'Internal Server Error'});
 
    }
     
 })
 
 router.put('/:candidateID',jwtAuthMiddleware,async(req,res)=>{

    try{
      if(! await checkAdminRole(requser.id))
      {
          return res.status(403).json({message: 'user has not admin role'});
      }

       const candidateID=req.params.candidateID;
       const updateCandidateData = req.body;

       const response = await Person.findByIdAndUpdate( candidateID,updateCandidateData,{
         new: true,
         runValidators: true
       })

       if(!response)
       {
         return res.status(404).json({error: 'Candidate not found'});
       }
       console.log('Candidate data updated');
       res.status(200).json(response);
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({error:"internal server error"})
    }
 })

 router.delete('/:candidateID',jwtAuthMiddleware,async(req,res)=>{

   try{
     if(! await checkAdminRole(requser.id))
     {
         return res.status(403).json({message: 'user has not admin role'});
     }

      const candidateID=req.params.candidateID;
      

      const response = await Person.findByIdAndDelete( candidateID)

      if(!response)
      {
        return res.status(404).json({error: 'Candidate not found'});
      }
      console.log('Candidate data deleted');
      res.status(200).json(response);
   }
   catch(err)
   {
       console.log(err);
       res.status(500).json({error:"internal server error"})
   }
})

router.post('/vote/:candidateID',jwtAuthMiddleware,async(req,res)=>{

   candidateID = req.params.candidateID;
   userID = req.user.id;
   

   try{
       const candidate = await Candidate.findById(candidateID);
     
       if(!candidate)
       {
         return res.status(404).json({message:'Candidate not found'});
       }

       const user = await User.findById(userID);

       if(!user)
       {
         return res.status(404).json({message:'Candidate not found'});
       }
       if(!user.isVoted){
         res.status(400).json({message:'You have already voted'});
       }
       if(user.role=='admin'){
         res.status(403).json({message: 'admin is not allowed to vote'})
       }

       candidate.votes.push({user:userID})
       candidate.voteCount++;
       await candidate.save();

       user.isVoted = true;
       await user.save();

       res.status(200).json({message: 'Vote recorded Successfully'});

   }catch(err)
   {
     console.log(err);
     res.status(500).json({error:'Internal Server Error'});
   }
})

router.get('/vote/count',async(req,res)=>{
   try{
         const candidate = await Candidate.find().sort({voteCount:'desc'});

         const voteRecord = candidate.map((data)=>{
            return {
               party: data.party,
               count: data.voteCount
            }
         });

         return res.status(200).json(voteRecord);
   }catch(err)
   {
      console.log(err);
     res.status(500).json({error:'Internal Server Error'});
   }
})
 module.exports = router;

  

 