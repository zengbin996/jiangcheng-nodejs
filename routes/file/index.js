const router = require('express').Router()
const COS = require('cos-nodejs-sdk-v5')
const multer = require('multer')
const { getCredential } = require('./oss-sts')

const cos = new COS({
  SecretId: process.env.SecretId,
  SecretKey: process.env.SecretKey,
})
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    // 指定文件名
    cb(null, file.originalname)
  },
})
const validates = (req, res, next) => {
  const file = req.file

  if (file) {
    next()
  } else {
    res.status(400).cc(undefined, '请添加文件')
  }
}

//保存文件
const uploadLocal = multer({ storage: storage }).single('file')

const uploadFile = (req, res) => {
  res.cc(req.file)
}

//上传到OSS
const uploadFileOss = (req, res) => {
  const file = req.file

  cos.uploadFile(
    {
      Bucket: process.env.Bucket,
      Region: process.env.Region,
      Key: file.originalname,
      FilePath: file.path,
    },
    (err, data) => {
      if (err) {
        res.status(500).cc(err)
      } else {
        res.cc(data)
      }
    }
  )
}

//获取临时秘钥
const getTmpSecretKey = (req, res) => {
  getCredential().then((details) => {
    res.cc(details)
  })
}

//上传文件 保存到服务器
router.post('/uploads', uploadLocal, validates, uploadFile)

//上传文件 保存到OSS
router.post('/uploads-oss', uploadLocal, validates, uploadFileOss)

//获取临时秘钥
router.get('/tmp-key', getTmpSecretKey)

module.exports = router
