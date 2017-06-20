const express = require('express');

const authRouter = express.Router({ mergeParams: true });

authRouter.route('/')
  .get((req, res) => {
    res.status(200)
      .json({ message: 'hey from auth' });
  });

module.exports = authRouter;
