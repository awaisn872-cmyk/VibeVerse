import jwt from 'jsonwebtoken';
export function protect(req,res,next){const h=req.headers.authorization||''; const token=h.startsWith('Bearer ')?h.slice(7):null; if(!token)return res.status(401).json({message:'Authentication required'}); try{req.user=jwt.verify(token,process.env.JWT_SECRET||'vibeverse_dev_secret'); next()}catch{res.status(401).json({message:'Invalid or expired token'})}}
