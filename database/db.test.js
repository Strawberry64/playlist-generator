import {
  addSong,
  createOrGetPlaylistId,
  addSongToPlaylist,
  getAllSongs,
  getAllPlaylists,
  getSongsForPlaylist,
} from "./db.js";

// Mock expo-sqlite async API so no real DB is used
jest.mock("expo-sqlite", () => ({
  openDatabaseAsync: jest.fn(() =>
    Promise.resolve({
      execAsync: jest.fn().mockResolvedValue(undefined),
      runAsync: jest.fn().mockResolvedValue(undefined),
      getAllAsync: jest.fn().mockResolvedValue([]),
      getFirstAsync: jest.fn().mockResolvedValue({ id: 1 }),
    })
  ),
}));

describe("Database functions (async SQLite)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("addSong should resolve without error", async () => {
    await expect(addSong("1","Test Song", "Test Artist")).resolves.toBeDefined();
  });

  test("createOrGetPlaylistId should return a string", async () => {
    const pid = await createOrGetPlaylistId("123","MyPlaylist",0);
    expect(typeof pid).toBe("string");
  });

  test("addSongToPlaylist should resolve without error", async () => {
    const pid = await createOrGetPlaylistId("123", "Rock Classics", 0);
    await expect(addSongToPlaylist(pid, "456")).resolves.toBeUndefined();
  });

  test("getAllSongs should return an array", async () => {
    const data = await getAllSongs();
    expect(Array.isArray(data)).toBe(true);
  });

  test("getAllPlaylists should return an array", async () => {
    const playlists = await getAllPlaylists();
    expect(Array.isArray(playlists)).toBe(true);
  });

  test("getSongsForPlaylist should return an array", async () => {
    const songs = await getSongsForPlaylist("123");
    expect(Array.isArray(songs)).toBe(true);
  });
});