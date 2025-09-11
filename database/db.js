import * as SQLite from 'expo-sqlite';
let db;
console.log('Starting database initialization');
const blah = async () => {
    db = await SQLite.openDatabaseAsync('test');
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS playlists (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT NOT NULL
        );
      `);

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS songs (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          artist TEXT NOT NULL,
          genre TEXT NULL
        );
      `);

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS playlist_songs (
          playlist_id INTEGER NOT NULL,
          song_id INTEGER NOT NULL,
          PRIMARY KEY (playlist_id, song_id),
          FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
          FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
        );
      `);
    console.log('Database initialized');
};
blah();

async function addSongToPlaylist(playlistId, name, artist) {

    await db.runAsync(
        `INSERT INTO songs (name, artist) VALUES (?, ?);`,
        name, artist
    ).catch(() => { }); // ignore duplicate error if you add a UNIQUE later

    const song = await db.getFirstAsync(
        `SELECT id FROM songs WHERE name = ? AND artist = ? ORDER BY id DESC LIMIT 1;`,
        name, artist
    );

    await db.runAsync(
        `INSERT OR IGNORE INTO playlist_songs (playlist_id, song_id) VALUES (?, ?);`,
        playlistId, song.id
    );
}

// this function creates a song with the given attributes
async function createSong( name, artist, genre) {
    await db.runAsync(
        `INSERT INTO songs ( name, artist, genre) VALUES ( ?, ?, ?);`,
         name, artist, genre
    ); // ignore duplicate error if you add a UNIQUE later
    const allSongs = await db.getAllAsync(`SELECT * FROM songs WHERE id = ?;`, id);
    console.log("All songs:", allSongs);
}

// this functions creats a playlist and returns the id of the created playlist with the given name
async function createOrGetPlaylistId(name) {
    await db.runAsync(`INSERT INTO playlists (name) VALUES (?);`, name).catch(() => {});
    const row = await db.getFirstAsync(
      `SELECT id FROM playlists WHERE name = ? ORDER BY id DESC LIMIT 1;`,
      name
    );
    const allPlaylists = await db.getAllAsync(`SELECT * FROM playlists WHERE name = ?;`, name);
    console.log("All playlists:", allPlaylists);

    return row?.id;
  }

  async function retrieve() {
    const allRows = await db.getAllAsync(`SELECT * FROM playlists;`);
    console.log("All rows:", allRows);
    allRows.forEach((row, index) => {
        console.log(`Row ${index + 1}:`, row);
    });
    return allRows;
}
  
export { addSongToPlaylist,createSong, retrieve,createOrGetPlaylistId };