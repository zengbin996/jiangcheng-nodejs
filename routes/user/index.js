const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { connect } = require('../../utils/db/index');
const validates = require('../../utils/validates/users');

//登录
const getAuthSign = async (req, res) => {
  const db = await connect();
  const collection = db.collection('users');
  const userInfo = { username: req.body.username, password: req.body.password };

  const single = await collection.findOne(userInfo);

  if (single) {
    const userInfo = { ...single, password: undefined };
    const token = jwt.sign(userInfo, process.env.PRIVATE_KEY, { expiresIn: '7d' });

    res.cc({
      authorization: {
        token: token,
        expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      },
      userInfo: userInfo,
    });
  } else {
    res.status(400).cc(undefined, 'The user name or password is wrong.');
  }
};

//注册
const addUser = async (req, res) => {
  const db = await connect();
  const collection = db.collection('users');

  const single = await collection.findOne({ username: req.body.username });
  if (!single) {
    collection
      .insertOne({
        username: req.body.username,
        password: req.body.password,
      })
      .then((insertResult) => {
        res.cc(insertResult);
      });
  } else {
    res.status(400).cc(undefined, '用户名已经被使用');
  }
};

//修改密码
const updatePassword = async (req, res) => {
  const db = await connect();
  const collection = db.collection('users');

  const single = await collection.findOne({ username: req.body['username'], password: req.body['old-password'] });

  if (single) {
    collection
      .updateOne(
        {
          username: req.body['username'],
        },
        {
          $set: {
            password: req.body['new-password'],
          },
        }
      )
      .then((insertResult) => {
        res.cc(insertResult);
      });
  } else {
    res.status(400).cc(undefined, 'The user name or password is wrong.');
  }
};

//更新用户信息
const updateUserinfo = async (req, res) => {
  res.cc('正在开发中...');
};

//删除账号
const deleteUser = (req, res) => {
  res.cc('正在开发中...');
};

router.post('/auth-sign', validates.AuthSign, getAuthSign);
// router.post('/', validates.addUser, addUser);
// router.patch('/update-password', validates.updatePassword, updatePassword);
// router.patch('/update-userinfo', validates.updateUserinfo, updateUserinfo);
// router.delete('/', deleteUser);

module.exports = router;
