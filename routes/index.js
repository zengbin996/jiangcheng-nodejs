const express = require('express');
const router = express.Router();
const userRouter = require('./user');
const rulesRouter = require('./user/rules');
const fileRouter = require('./file');
const photosRouter = require('./photos');

router.use('/user', userRouter);
router.use('/user/rules', rulesRouter);
router.use('/file', fileRouter);
router.use(photosRouter);

//测试使用
router.post('/test', (req, res) => {
  res.cc('正在开发中...');
});

module.exports = router;
