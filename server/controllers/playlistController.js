import Playlist from '../models/Playlist.js';

export async function listPlaylists(req, res, next) {
  try {
    const playlists = await Playlist.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(playlists);
  } catch (e) {
    next(e);
  }
}

export async function createPlaylist(req, res, next) {
  try {
    const name = String(req.body?.name || '').trim();

    if (!name) {
      return res.status(400).json({ message: 'Playlist name is required.' });
    }

    const playlist = await Playlist.create({
      userId: req.user.id,
      name,
      songs: [],
    });

    res.status(201).json(playlist);
  } catch (e) {
    next(e);
  }
}
