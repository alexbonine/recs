const express = require('express');
const authRouter = require('./auth');

const router = express.Router();
router.use('/auth', authRouter);

// router.use(function (req, res, next) {
//   const cookie = req.cookies['recs_alexbonine_token']; //todo const
//   if (cookie) 
//   next();
// });

router.get('/', function (req, res) {
  res.json({ message: 'testing' });
});

module.exports = router;
