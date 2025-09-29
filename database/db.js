
import * as SQLite from 'expo-sqlite';

let db = null;
let ready = null; // prevents race conditions

export async function initDb() {
  if (ready) return ready;
  ready = (async () => {
    db = await SQLite.openDatabaseAsync('test');

    // db.execAsync("DROP TABLE IF EXISTS playlist_songs;");
    // db.execAsync("DROP TABLE IF EXISTS songs;");  
    // db.execAsync("DROP TABLE IF EXISTS playlists;");
    // console.log('DELETING TABles');

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS playlists (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        track_total INTEGER DEFAULT 0
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS songs (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        artist TEXT NOT NULL
        
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS playlist_songs (
        playlist_id TEXT NOT NULL,
        song_id TEXT NOT NULL,
        PRIMARY KEY (playlist_id, song_id),
        FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
        FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
      );
    `);
    console.log('Database initialized');
  })();
  return ready;
}


 async function createOrGetPlaylistId(id,name,track_total) {
  await initDb();
  await db.runAsync(`INSERT INTO playlists (id,name,track_total) VALUES (?,?,?);`, 
    id,name,track_total).catch(() => { });
  return id;
}


async function addSongToPlaylist(playlistId,songId ) {
  await initDb();

  await db.runAsync(
    `INSERT OR IGNORE INTO playlist_songs (playlist_id, song_id)
     VALUES (?, ?)`,
    playlistId,
    songId
  );
}

// this function creates a song with the given attributes
 async function addSong(id, name, artist, ) {
  await initDb();
  await db.runAsync(`INSERT INTO songs (id, name, artist) VALUES (?,?, ?);` ,id,name, artist).catch(() => {}); 
    const row = await db.getFirstAsync(
    `SELECT id FROM songs WHERE name = ? AND artist = ? ORDER BY id DESC LIMIT 1;`,
    name, artist
  );
  return row && row.id;
}


 async function getAllSongs() {
  await initDb();
  return db.getAllAsync(`SELECT * FROM songs;`);
}
 async function getAllPlaylists() {
  await initDb();
  return db.getAllAsync(`SELECT * FROM playlists;`);
}

 async function getSongsForPlaylist(playlistId) {
  await initDb();
  return db.getAllAsync(`
    SELECT s.id, s.name, s.artist 
    FROM songs s 
    JOIN playlist_songs ps ON s.id = ps.song_id 
    WHERE ps.playlist_id = ?
  `, playlistId);
}

export { addSong, addSongToPlaylist, createOrGetPlaylistId, getAllPlaylists, getAllSongs, getSongsForPlaylist };
