const router = require('express').Router();
const crypto = require('crypto');
const path = require('path');
const COS = require('cos-nodejs-sdk-v5');
const multer = require('multer');
const { getCredential } = require('./oss-sts');

const cos = new COS({
  SecretId: process.env.SecretId,
  SecretKey: process.env.SecretKey,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    // 指定文件名
    cb(null, file.originalname);
  },
});
const validates = (req, res, next) => {
  const file = req.file;

  if (file) {
    next();
  } else {
    res.status(400).cc(undefined, '请添加文件');
  }
};

//保存文件
const uploadLocal = multer({ storage: storage }).single('file');

const uploadFile = (req, res) => {
  res.cc(req.file);
};

//上传到OSS
const uploadFileOss = (req, res) => {
  const file = req.file;
  const randomFileName = crypto.randomBytes(8).toString('hex') + path.extname(file.originalname);

  cos.uploadFile(
    {
      Bucket: process.env.Bucket,
      Region: process.env.Region,
      Key: randomFileName,
      FilePath: file.path,
    },
    (err, data) => {
      if (err) {
        res.status(500).cc(err);
      } else {
        res.cc(data);
      }
    }
  );
};

//获取临时秘钥
const getTmpSecretKey = (req, res) => {
  getCredential().then((details) => {
    res.cc(details);
  });
};

//上传文件 保存到服务器
router.post('/uploads', uploadLocal, validates, uploadFile);

//上传文件 保存到OSS
router.post('/uploads-oss', uploadLocal, validates, uploadFileOss);

//获取临时秘钥
router.get('/tmp-key', getTmpSecretKey);

//获取地区列表
router.get('/pca-code', (req, res) => {
  const list = require('../../public/assets/pca-code.json');

  const transformTree = (data) => {
    return data.map((item) => {
      const newItem = {
        label: item.name,
        value: item.code,
      };
      if (item.children && Array.isArray(item.children)) {
        newItem.children = transformTree(item.children);
      }
      return newItem;
    });
  };

  res.cc(transformTree(list));
});

//获取标签列表
router.get('/tag', (req, res) => {
  const list = ['日落', '海边', '雪景', '蓝天白云', '草原'];
  res.cc(list.map((a) => ({ label: a, value: a })));
});

module.exports = router;
