import {api} from './api'; export const fetchMe=()=>api.get('/users/me'); export const fetchPlaylists=()=>api.get('/playlists'); export const createPlaylist=name=>api.post('/playlists',{name});
