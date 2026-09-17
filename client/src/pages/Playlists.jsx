import { useAuth } from '../context/AuthContext';
import { useCallback, useEffect, useState } from 'react';
import { api, setAuth } from '../services/api';
import { Link } from 'react-router-dom';

export default function Playlists() {
  const { user, token } = useAuth();
  const [name, setName] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadPlaylists = useCallback(async () => {
    if (!user || !token) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setError('');
      setAuth(token);
      const { data } = await api.get('/playlists');
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load playlists:', err);
      setError(err.response?.data?.message || 'Could not load your playlists.');
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    loadPlaylists();
  }, [loadPlaylists]);

  const add = async () => {
    const trimmedName = name.trim();
    if (!user || !token || !trimmedName || saving) return;

    try {
      setSaving(true);
      setError('');
      setAuth(token);
      const { data } = await api.post('/playlists', { name: trimmedName });

      // Add the actual MongoDB document returned by the API.
      setItems((current) => [data, ...current]);
      setName('');
    } catch (err) {
      console.error('Failed to create playlist:', err);
      setError(err.response?.data?.message || 'Playlist could not be saved. Please check the backend.');
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') add();
  };

  return (
    <main className="page">
      <div className="page-title">
        <span className="kicker">YOUR COLLECTION</span>
        <h1>My <em>playlists</em></h1>
        <p>Your playlists are stored in MongoDB and will remain available after a refresh or new login.</p>
      </div>

      {user ? (
        <>
          <div className="playlist-create">
            <input
              placeholder="Playlist name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={80}
            />
            <button className="primary" onClick={add} disabled={saving || !name.trim()}>
              {saving ? 'Saving...' : 'Create playlist'}
            </button>
          </div>

          {error && <p className="error playlist-error">{error}</p>}

          {loading ? (
            <div className="empty playlist-status"><p>Loading your playlists...</p></div>
          ) : items.length === 0 ? (
            <div className="empty playlist-status">
              <h2>No playlists yet</h2>
              <p>Create your first playlist above.</p>
            </div>
          ) : (
            <div className="playlist-grid">
              {items.map((playlist) => (
                <div className="playlist" key={playlist._id || playlist.id}>
                  <div>♫</div>
                  <h3>{playlist.name}</h3>
                  <p>{Array.isArray(playlist.songs) ? playlist.songs.length : 0} songs</p>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="empty">
          <h2>Sign in to create playlists</h2>
          <Link to="/login" className="primary">Sign in</Link>
        </div>
      )}
    </main>
  );
}
