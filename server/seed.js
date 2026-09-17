import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import Movie from "./models/Movie.js";
import Music from "./models/Music.js";
import Artist from "./models/Artist.js";
import { movies, music, artists } from "./data/seedData.js";

await connectDB();

const indianMovies = movies
  .filter((item) => String(item.id).startsWith("inm"))
  .slice(0, 50);

const indianMusic = music
  .filter((item) => String(item.id).startsWith("ins"))
  .slice(0, 50);

for (const movie of indianMovies) {
  const { id, ...data } = movie;

  await Movie.updateOne(
    { title: data.title },
    { $set: data },
    { upsert: true }
  );
}

for (const song of indianMusic) {
  const { id, ...data } = song;

  await Music.updateOne(
    { title: data.title },
    { $set: data },
    { upsert: true }
  );
}

for (const artist of artists) {
  const { id, ...data } = artist;
  await Artist.updateOne(
    { name: data.name },
    { $set: data },
    { upsert: true }
  );
}

console.log(
  `Seeded ${indianMovies.length} Indian movies, ${indianMusic.length} Indian songs and ${artists.length} artists.`
);

process.exit(0);