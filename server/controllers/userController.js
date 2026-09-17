import User from '../models/User.js'; export async function me(req,res,next){try{const u=await User.findById(req.user.id).select('-password');res.json(u||{id:req.user.id})}catch(e){next(e)}}
