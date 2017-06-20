// needed for IE
require('whatwg-fetch');
if (!window.Promise) {
  window.Promise = require('promise-polyfill');
}
if (typeof Object.assign != 'function') {
  Object.assign = require('./assignPolyfill');
}

const fetcher = require('./fetcher');

const getAuth = () => {
  fetcher('/api/auth')
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log('fetch err', err);
    });
}

const openSpotifyPopup = () => {
  const self = this;
  const params = 'location:0,status=0,width=400,height=300';
  
  const win = window.open(window.spotifyAuthUrl, 'Login to Spotify', params);

  const interval = window.setInterval(() => {
    if (!win || win.closed) {
      window.clearInterval(interval);
      getAuth();
    }
  }, 1000);
};

window.openSpotifyPopup = openSpotifyPopup;
