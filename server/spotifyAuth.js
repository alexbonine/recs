const SpotifyWebApi = require('spotify-web-api-node');
const { spotifyCredentials } = require('./env.js');

const scopes = ['playlist-read-private', 'playlist-read-collaborative', 'playlist-modify-public',
  'playlist-modify-private', 'user-follow-read', 'user-top-read'];
const privateState = 'lemur';

const spotifyApi = new SpotifyWebApi(spotifyCredentials);

const authorizeUrl = spotifyApi.createAuthorizeURL(scopes, privateState);

let expiration;
const calculateExpiration = (expiresIn) => {
  return Date.now() + expiresIn * 1000;
}

const getTokens = (code) => {
  return spotifyApi.authorizationCodeGrant(code)
    .then((data) => {  // set in db
      expiration = calculateExpiration(data.body['expires_in']);
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi.setRefreshToken(data.body['refresh_token']);
      return data.body['access_token'];
    }, (err) => {
      console.log('Something went wrong!', err);
    });
}

const refreshAccessToken = () => {
  return spotifyApi.refreshAccessToken()
    .then((data) => {
      setExpiration(data.body['expires_in']);
      spotifyApi.setAccessToken(data.body['access_token']);
    }, (err) => {
      console.log('Could not refresh access token', err);
    });
}

const checkExpiration = () => {
  return new Promise((resolve, reject) => {
    if (Date.now() > expiration) {
      refreshAccessToken()
        .then(resolve)
        .catch(reject);
    } else {
      resolve();
    }
  });
}

module.exports = {
  authorizeUrl,
  checkExpiration,
  privateState,
  getTokens,
  spotifyApi,
};
