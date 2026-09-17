import {api} from './api'; export const fetchMovies=()=>api.get('/movies'); export const fetchMovie=id=>api.get(`/movies/${id}`);
