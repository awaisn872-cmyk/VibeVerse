import {Router} from 'express'; import {getMovie,getMovies} from '../controllers/movieController.js'; const r=Router(); r.get('/',getMovies); r.get('/:id',getMovie); export default r;
