const router = require('express').Router();
const { connect } = require('../../utils/db/index');
const validates = require('../../utils/validates/users');
const SHEET_NAME = 'roles';

// 增加角色
const addOneRole = async (req, res) => {
  const db = await connect();
  const collection = db.collection(SHEET_NAME);

  const single = await collection.findOne({ pathName: req.body.pathName });

  if (!single) {
    collection.insertOne(req.body).then((insertResult) => {
      res.cc(insertResult);
    });
  } else {
    res.status(400).cc(undefined, `字段 ${req.body.pathName} 已经存在`);
  }
};

// 删除角色
const deleteOneRole = async (req) => {};

// 修改角色
const updateOneRole = async (req, res) => {};

// 查看角色
const getAllTheRoles = async (req, res) => {
  const db = await connect();
  const collection = db.collection(SHEET_NAME);
  const list = await collection.find().toArray();
  res.cc(list);
};

router.get('/', getAllTheRoles);
router.delete('/', deleteOneRole);
router.patch('/', updateOneRole);
router.post('/', addOneRole);

module.exports = router;
