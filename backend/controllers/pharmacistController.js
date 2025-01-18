import Pharmacist from '../models/pharmacist.js';
export async function getProfileByName(req,res)
{
  try{
    const name=req.user.name;

    if(!name)
    {
      res.status(400).json({error: 'Pharmacist name is required'});
      return;
    }
    const pharmacist=await Pharmacist.findOne({name});

    if(!pharmacist){
        res.status(200).json({error: 'Pharmacist name not found'});
        return;
    }
    res.status(200).json({success: true,pharmacist});
  }catch(error)
    {
      console.error('Error fetching pharmacist prifile',error);
      res.status(500).json({error: 'Internal serval error'});
    }
};
export default{
  getProfileByName
};
