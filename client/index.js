// needed for IE
require('whatwg-fetch');
if (!window.Promise) {
  window.Promise = require('promise-polyfill');
}
if (typeof Object.assign != 'function') {
  Object.assign = require('./assignPolyfill');
}

const fetcher = require('./fetcher');

let spotifyAuthorizeUrl = '';

const hideShow = () => {
  const show = document.getElementsByClassName('show');
  if (show.length) {
    for(let i = 0; i < show.length; i++ ) {
      show[i].classList.remove('show');
    }
  }
}

const transitionToLoggedIn = () => {
  hideShow();
  const good = document.getElementsByClassName('login-good');
  good[0].classList.add('show');
}

const openSpotifyPopup = () => {
  const self = this;
  const params = 'location:0,status=0,width=400,height=300';
  const win = window.open(spotifyAuthorizeUrl, 'Login to Spotify', params);

  const interval = window.setInterval(() => {
    if (!win || win.closed) {
      window.clearInterval(interval);
      // should check if good
      transitionToLoggedIn();
    }
  }, 1000);
};

window.openSpotifyPopup = openSpotifyPopup;


// check auth
fetcher('/api/auth')
  .then((data = {}) => {
    transitionToLoggedIn();
  })
  .catch((err = {}) => {
    if (err.status = 401 && err.data && err.data.authorizeUrl) {
      hideShow();
      const login = document.getElementsByClassName('login-needed');
      login[0].classList.add('show');
      spotifyAuthorizeUrl = err.data.authorizeUrl;
    } else {
      console.log('fetch err', err);
    }
  });
    