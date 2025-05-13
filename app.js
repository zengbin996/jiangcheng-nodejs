require('dotenv').config()
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const { expressjwt } = require('express-jwt')
const { ValidationError } = require('express-validation')
const { MongoError } = require('mongodb')
const swaggerDecs = require('./utils/docs')
const indexRouter = require('./routes')
const _ = require('lodash')
const { unless } = require('express-unless')

const app = express()

//设置跨域请求
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(swaggerDecs)

//封装处理方法
app.use((req, res, next) => {
  res.cc = (details, message = 'success') => {
    res.json({ details, message })
  }
  next()
})

// 授权是否登录
const unlessPath = [
  {
    url: '/user',
    methods: ['POST'],
  },
  {
    url: '/user/auth-sign',
    methods: ['POST'],
  },
  {
    url: '/user/update-password',
    methods: ['PATCH'],
  },
  {
    url: '/test',
  },
]
app.use(expressjwt({ secret: process.env.PRIVATE_KEY, algorithms: ['HS256'] }).unless({ path: unlessPath }))

// 自定义中间件进行二次验证码验证
const secondFactorAuthentication = (req, res, next) => {
  const currentItem = {
    methods: req.method,
    url: req.url,
  }

  const isRule = _.some(req.auth.rules, { s_rule: currentItem })

  if (isRule) {
    next()
    return
  }

  res.status(401).cc('用户没有权限访问')
}

secondFactorAuthentication.unless = unless
app.use(secondFactorAuthentication.unless({ path: unlessPath }))
app.use(indexRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  //数据验证错误
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err)
  }
  //数据库错误
  if (err instanceof MongoError) {
    return res.status(500).json({
      message: 'MongoError',
      err,
    })
  }
  res.status(err.status).json(err)
})

module.exports = app
