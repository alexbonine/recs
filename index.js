const express = require('express');
const path = require('path');

const app = express();
app.set('port', (process.env.PORT || 5000));

app.get('/callback', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/callback.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
