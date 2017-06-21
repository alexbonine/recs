const express = require('express');
const { authorizeUrl } = require('../spotifyAuth.js');

const authRouter = express.Router({ mergeParams: true });

authRouter.route('/')
  .get((req, res) => {
    // if cookie & valid, return good
    // if cookie & expired, refresh and return cookie & good
    // else return auth url
    res.status(401)
      .json({ authorizeUrl });

    // res.status(200)
    //   .json({ message: 'hey from auth' });
  });

module.exports = authRouter;
