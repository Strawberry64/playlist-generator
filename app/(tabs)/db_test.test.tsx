import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import DatabaseScreen from "./db_test";
import * as db from "../../database/db.js";

// Mock database functions so no real DB is touched
jest.mock("../../database/db.js");

// Mock expo-sqlite so it doesn’t crash
jest.mock("expo-sqlite", () => ({
  openDatabaseAsync: jest.fn(() => Promise.resolve({
    transaction: jest.fn(),
    exec: jest.fn(),
  })),
}));

// Mock react-navigation bottom tabs
jest.mock("@react-navigation/bottom-tabs", () => {
  return {
    useBottomTabBarHeight: () => 0,
  };
});

describe("DatabaseScreen Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("calls createSong when 'Add Song' is pressed", async () => {
    const { getByPlaceholderText, getByText } = render(<DatabaseScreen />);

    fireEvent.changeText(getByPlaceholderText("Enter your song name"), "Test Song");
    fireEvent.changeText(getByPlaceholderText("Enter your artist name"), "Test Artist");

    fireEvent.press(getByText("Add Song"));

    await waitFor(() => {
      expect(db.createSong).toHaveBeenCalledWith("Test Song", "Test Artist");
    });
  });

  test("calls createOrGetPlaylistId when 'Add Playlist' is pressed", async () => {
    const { getByPlaceholderText, getByText } = render(<DatabaseScreen />);

    fireEvent.changeText(getByPlaceholderText("Enter your playlist name"), "MyPlaylist");

    fireEvent.press(getByText("Add Playlist"));

    await waitFor(() => {
      expect(db.createOrGetPlaylistId).toHaveBeenCalledWith("MyPlaylist");
    });
  });

  test("calls addSongToPlaylist when 'Add Song to playlist' is pressed", async () => {
    // mock createOrGetPlaylistId to return an ID
    (db.createOrGetPlaylistId as jest.Mock).mockResolvedValue(123);

    const { getByPlaceholderText, getByText } = render(<DatabaseScreen />);

    fireEvent.changeText(getByPlaceholderText("Enter your playlist name"), "Rock Classics");
    fireEvent.changeText(getByPlaceholderText("Enter your song name"), "Bohemian Rhapsody");
    fireEvent.changeText(getByPlaceholderText("Enter your artist name"), "Queen");

    fireEvent.press(getByText("Add Song to playlist"));

    await waitFor(() => {
      expect(db.addSongToPlaylist).toHaveBeenCalledWith(
        123,
        "Bohemian Rhapsody",
        "Queen"
      );
    });
  });
});
