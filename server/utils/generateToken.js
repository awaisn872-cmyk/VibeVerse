import jwt from 'jsonwebtoken';
export const generateToken=(id)=>jwt.sign({id},process.env.JWT_SECRET||'vibeverse_dev_secret',{expiresIn:'7d'});
