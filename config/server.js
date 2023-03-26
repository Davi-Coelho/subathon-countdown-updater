const express = require('express')
const app = express()

app.use('/', express.static('./app/public'))

module.exports = app