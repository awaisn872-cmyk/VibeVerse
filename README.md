# VibeVerse — Full MERN Entertainment Platform

VibeVerse is structured as a real React + Express + MongoDB-ready application.

## Project structure
```text
VibeVerse/
├── client/  # React + Vite frontend
│   ├── public/images/{movies,artists,music}
│   └── src/{components,pages,context,services,data,assets}
├── server/  # Node + Express backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── data
│   └── utils
├── .env.example
├── package.json
└── README.md
```

## Run locally
1. Install Node.js 18+.
2. Open the root `VibeVerse` folder in VS Code.
3. Run:
   ```bash
   npm install
   ```
   This installs root, React client and Express server dependencies.
4. Optional MongoDB: copy `server/.env.example` to `server/.env` and set `MONGO_URI` and `JWT_SECRET`.
5. Run:
   ```bash
   npm run dev
   ```
6. Open `http://localhost:5173`.

The app has demo data fallback, so the catalog still displays if MongoDB is not running. Authentication/playlist API persistence requires MongoDB.

## Production
```bash
npm run build
npm start
```

## Media
The catalog includes current/famous movie titles, artist artwork and music entries. Movie and music buttons use external YouTube search/official-result pages. No copyrighted audio is bundled.
