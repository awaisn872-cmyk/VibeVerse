import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MusicPlayer from './components/MusicPlayer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import Music from './pages/Music';
import Artists from './pages/Artists';
import ArtistDetails from './pages/ArtistDetails';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Playlists from './pages/Playlists';
import Watchlist from './pages/Watchlist';
import Favorites from './pages/Favorites';
import { Login, Signup } from './pages/Auth';
import NotFound from './pages/NotFound';


// Breadcrumb Component
function Breadcrumb() {
  const location = useLocation();

  const path = location.pathname;

  // Home page par breadcrumb hide
  if (path === '/') return null;

  const parts = path.split('/').filter(Boolean);

  const formatName = (text) => {
    return text
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getPageName = () => {
    if (path.startsWith('/movies/')) return 'Movie Details';
    if (path.startsWith('/artists/')) return 'Artist Details';

    const names = {
      movies: 'Movies',
      music: 'Music',
      artists: 'Artists',
      search: 'Search',
      login: 'Login',
      signup: 'Sign Up',
      profile: 'Profile',
      playlists: 'Playlists',
      watchlist: 'Watchlist',
      favorites: 'Favorites',
    };

    return names[parts[0]] || formatName(parts[0]);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
      <div className="max-w-7xl mx-auto">

        <div
          className="
            inline-flex
            items-center
            gap-2
            px-4
            py-2.5
            rounded-xl

            bg-white/[0.04]
            backdrop-blur-md

            border
            border-white/[0.08]

            shadow-[0_8px_30px_rgba(0,0,0,0.12)]

            text-sm
            sm:text-[15px]

            transition-all
            duration-300

            hover:border-white/[0.14]
            hover:bg-white/[0.06]
          "
        >

          {/* Home */}
          <Link
            to="/"
            className="
              flex
              items-center
              gap-1.5
              font-medium
              text-white/80
              hover:text-white
              transition-colors
              duration-200
            "
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>

            <span>Home</span>
          </Link>

          {/* Arrow */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white/30 shrink-0"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>

          {/* Current Page */}
          <span
            className="
              text-white
              font-semibold
              capitalize
              truncate
              max-w-[180px]
              sm:max-w-none
            "
          >
            {getPageName()}
          </span>

        </div>

      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>

      <Navbar />

      {/* Breadcrumb automatically appears on every page */}
      <Breadcrumb />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />

        <Route path="/music" element={<Music />} />

        <Route path="/artists" element={<Artists />} />
        <Route path="/artists/:id" element={<ArtistDetails />} />

        <Route path="/search" element={<Search />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/playlists"
          element={
            <ProtectedRoute>
              <Playlists />
            </ProtectedRoute>
          }
        />

        <Route path="/watchlist" element={<Watchlist />} />

        <Route path="/favorites" element={<Favorites />} />

        <Route path="*" element={<NotFound />} />

      </Routes>

      <MusicPlayer />

      <Footer />

    </BrowserRouter>
  );
}