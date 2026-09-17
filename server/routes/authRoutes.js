import {Router} from 'express'; import {login,signup} from '../controllers/authController.js'; const r=Router(); r.post('/signup',signup); r.post('/login',login); export default r;
