import { Song } from "../../src/models/song-model";

describe("Song Model", () => {
  it("should create a song with the correct properties", () => {
    const song = new Song({
      name: "My Song",
      artist: "John Doe",
      album: "My Album",
      providerUrl: "https://example.com/song",
      imageUrl: "https://example.com/song.jpg",
    });

    expect(song.name).toBe("My Song");
    expect(song.artist).toBe("John Doe");
    expect(song.album).toBe("My Album");
    expect(song.providerUrl).toBe("https://example.com/song");
    expect(song.imageUrl).toBe("https://example.com/song.jpg");
  });

  it("should require all properties", () => {
    const song = new Song({});

    const validationError = song.validateSync();
    expect(validationError?.errors.name).toBeDefined();
    expect(validationError?.errors.artist).toBeDefined();
    expect(validationError?.errors.album).toBeDefined();
    expect(validationError?.errors.providerUrl).toBeDefined();
    expect(validationError?.errors.imageUrl).toBeDefined();
  });
});
