import {
  createSong,
  createOrGetPlaylistId,
  addSongToPlaylist,
  retrieve,
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
    await expect(addSong(0,"Test Song", "Test Artist")).resolves.toBeDefined();
  });

  test("createOrGetPlaylistId should return a number", async () => {
    const pid = await createOrGetPlaylistId("MyPlaylist");
    expect(typeof pid).toBe("text");
  });

  test("addSongToPlaylist should resolve truthy", async () => {
    const pid = await createOrGetPlaylistId("Rock Classics");
    const added = await addSongToPlaylist(pid, "Bohemian Rhapsody", "Queen");
    expect(added).toBeTruthy();
  });

  test("retrieve should return an array or object", async () => {
    const data = await retrieve();
    expect(Array.isArray(data) || typeof data === "object").toBe(true);
  });
});