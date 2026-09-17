import Artist from '../models/Artist.js';
import { artists } from '../data/seedData.js';

export async function getArtists(req, res, next) {
  try {
    if (Artist.db.readyState === 1) {
      const data = await Artist.find();
      return res.json(data.length >= 12 ? data : artists);
    }
    res.json(artists);
  } catch (e) {
    res.json(artists);
  }
}

export async function getArtist(req, res, next) {
  try {
    if (Artist.db.readyState === 1) {
      const found = await Artist.findOne({ id: req.params.id });
      if (found) return res.json(found);
    }
    const x = artists.find((a) => a.id === req.params.id);
    x ? res.json(x) : res.status(404).json({ message: 'Artist not found' });
  } catch (e) {
    const x = artists.find((a) => a.id === req.params.id);
    x ? res.json(x) : next(e);
  }
}
