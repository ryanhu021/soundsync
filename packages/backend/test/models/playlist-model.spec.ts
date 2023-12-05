import { Playlist } from "../../src/models/playlist-model";

describe("Playlist Model", () => {
  it("should create a playlist with the correct properties", () => {
    const playlist = new Playlist({
      name: "My Playlist",
      creator: "111111111111111111111111",
      creatorName: "John Doe",
      songs: ["111111111111111111111111", "111111111111111111111112"],
      imageUrl: "https://example.com/playlist.jpg",
    });

    expect(playlist.name).toBe("My Playlist");
    expect(playlist.creator.toString()).toBe("111111111111111111111111");
    expect(playlist.creatorName).toBe("John Doe");
    expect(playlist.songs.at(0)?.toString()).toBe("111111111111111111111111");
    expect(playlist.songs.at(1)?.toString()).toBe("111111111111111111111112");
    expect(playlist.imageUrl).toBe("https://example.com/playlist.jpg");
  });

  it("should require a name and creatorName", () => {
    const playlist = new Playlist({
      creator: "user123",
      songs: ["song123", "song456"],
    });

    const validationError = playlist.validateSync();
    expect(validationError?.errors.name).toBeDefined();
    expect(validationError?.errors.creatorName).toBeDefined();
  });
});
