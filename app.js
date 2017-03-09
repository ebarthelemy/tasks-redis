const bodyParser = require('body-parser')
const ejs = require('ejs')
const express = require('express')
const logger = require('morgan')
const path = require('path')
const redis = require('redis')

var app = express()

// Setup
app.set('views', path.join(__dirname, 'views'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.get('/', (req, res) => {
  res.send('Welcome')
})

// Start
app.listen(3000)
console.log("Server started on port 3000.")

module.exports = app
