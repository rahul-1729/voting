const express = require('express');
const router = express.Router();
const Candidate = require('./../models/candidate')
const {jwtAuthMiddleware,generateToken} = require('./../jwt');


const checkAdminRole = async(userID)=>{
    try{
      const user = await User.findById(userID);
      return user.role==='admin';
    }
    catch(err){
      return false;
    }
}

router.post('/',jwtAuthMiddleware,async(req,res)=>{
    try{
      
      if(!checkAdminRole(req.user.id))
      {
          return res.status(403).json({message: 'user has not admin role'});
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
      if(!checkAdminRole(requser.id))
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
     if(!checkAdminRole(requser.id))
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

 module.exports = router;

  

 