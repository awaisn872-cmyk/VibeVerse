import {Router} from 'express'; import {getArtist,getArtists} from '../controllers/artistController.js'; const r=Router(); r.get('/',getArtists); r.get('/:id',getArtist); export default r;
