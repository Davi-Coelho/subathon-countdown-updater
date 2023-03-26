const cors = require('cors')
const express = require('express')
const app = express()

app.use(cors({ methods: ['GET'] }))
app.use('/', express.static('./app/public'))

module.exports = app