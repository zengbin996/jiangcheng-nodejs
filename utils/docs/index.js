const express = require('express')
const router = express.Router()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../docs/swagger.json')

router.use('/desc', swaggerUi.serve)
router.get('/desc', swaggerUi.setup(swaggerDocument))

module.exports = router
