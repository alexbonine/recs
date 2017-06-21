const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const key = fs.readFileSync(path.join(__dirname, 'certs', 'recs.alexbonine.com.key'));
const cert = fs.readFileSync(path.join(__dirname, 'certs', 'recs.alexbonine.com.crt'));
const { privateState, getTokens } = require('./spotifyAuth.js');
const api = require('./api/router.js');

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));

app.use('/api', api);

app.get('/callback', (req, res) => {
  if (req.query.error || !req.query.code) {
    // return spotify login issue
  } else if (req.query.state !== privateState) {
    // return bad shit
  } else {
    getTokens(req.query.code)
      .then((accessToken) => {
        res.cookie('recs_alexbonine_token', accessToken, { httpOnly: true, secure: true })
          .sendFile(path.join(__dirname, '../', '/client/callback.html'));
      })
      .catch(() => {
        res.sendFile(path.join(__dirname, '../', '/client/notloggedin.html'));
      });
  }
});

app.use(express.static(path.join(__dirname, '../', '/public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../', '/client/index.html'));
});

app.get('*', (req, res) => {
  res.sendFile('404.html');
});

https.createServer({ key, cert }, app).listen(app.get('port'), function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log('==> 🌎 Listening on port %s. Open up https://localhost:%s/ in your browser.', app.get('port'), app.get('port'));
  }
});
