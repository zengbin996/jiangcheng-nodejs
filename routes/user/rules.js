const router = require('express').Router()
const { connect } = require('../../utils/db/index')
const validates = require('../../utils/validates/users')
const SHEET_NAME = 'rules'

// 增加权限
const addOneRule = async (req, res) => {
  const db = await connect()
  const collection = db.collection(SHEET_NAME)

  const data = {
    ...req.body,
    create_time: new Date(),
    create_user: req.auth._id,
  }

  collection.insertOne(data).then((insertResult) => {
    res.cc(insertResult)
  })

  return

  const single = await collection.findOne({ pathName: req.body.pathName })

  if (!single) {
    collection.insertOne(req.body).then((insertResult) => {
      res.cc(insertResult)
    })
  } else {
    res.status(400).cc(undefined, `字段 ${req.body.pathName} 已经存在`)
  }
}

// 删除权限
const deleteOneRule = async (req, res) => {
  const db = await connect()
  const collection = db.collection(SHEET_NAME)

  const result = await collection.deleteMany({})

  res.cc(result)
}

// 修改权限
const updateOneRule = async (req, res) => {}

// 查看权限
const getAllTheRules = async (req, res) => {
  const db = await connect()
  const collection = db.collection(SHEET_NAME)
  const list = await collection.find().toArray()
  res.cc(list)
}

router.get('/', getAllTheRules)
router.delete('/', deleteOneRule)
router.patch('/', updateOneRule)
router.post('/', addOneRule)

module.exports = router
