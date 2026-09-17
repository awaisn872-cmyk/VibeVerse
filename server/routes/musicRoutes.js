import {Router} from 'express'; import {getMusic} from '../controllers/musicController.js'; const r=Router(); r.get('/',getMusic); export default r;
