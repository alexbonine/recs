const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const cookieParser = require('cookie-parser');
const key = fs.readFileSync(path.join(__dirname, 'certs', 'recs.alexbonine.com.key'));
const cert = fs.readFileSync(path.join(__dirname, 'certs', 'recs.alexbonine.com.crt'));
const { authorizeUrl, privateState, setTokens } = require('./spotify.js');

const app = express();
app.use(cookieParser());
app.set('port', (process.env.PORT || 5000));

app.get('/callback', (req, res) => {
  console.log('callback', req.query)
  if (req.query.error || !req.query.code) {
    // return spotify login issue
  } else if (req.query.state !== privateState) {
    // return bad shit
  } else {
    setTokens(req.query.code);
    res.sendFile(path.join(__dirname, '../', '/client/callback.html'));
  }
});

app.get('*', (req, res) => {
  let data = fs.readFileSync(path.join(__dirname, '../', '/client/index.html'));
  if(data) {
  // console.log(req.cookies) 
  // res.cookie('spotifyAuthUrl', authorizeUrl);
  // res.sendFile(path.join(__dirname, '../', '/client/index.html'));
    res.send(data.toString().replace(/set-url/g, authorizeUrl));
  } else {
    res.sendFile('404.html');
  }
});

https.createServer({ key, cert }, app).listen(app.get('port'), function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log('==> 🌎 Listening on port %s. Open up https://localhost:%s/ in your browser.', app.get('port'), app.get('port'));
  }
});
