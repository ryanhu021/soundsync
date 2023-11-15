import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export const example = async () => {
  spotifyApi.clientCredentialsGrant().then(
    (data) => {
      spotifyApi.setAccessToken(data.body["access_token"]);
      // https://www.npmjs.com/package/spotify-web-api-node
      // do whatever function here
      // ex. get artist albums
      spotifyApi.getArtistAlbums("43ZHCT0cAZBISjO8DG9PnE").then(
        (data) => {
          console.log("Artist albums", data.body);
        },
        (err) => console.error(err)
      );
    },
    (err) => console.log(err)
  );
};
