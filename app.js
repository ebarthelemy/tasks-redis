const bodyParser = require('body-parser')
const ejs = require('ejs')
const express = require('express')
const logger = require('morgan')
const path = require('path')
const redis = require('redis')

var app = express()

// Create Client
var client = redis.createClient()

client.on('connect', () => {
  console.log("Redis server connected...")
})

// Setup
app.set('views', path.join(__dirname, 'views'))
app.set('views engine', 'ejs')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.get('/', (req, res) => {
  var title = "Task List"

  // Fetch all the items in the list.
  client.lrange('tasks', 0, -1, (err, reply) => {
    res.render('index.ejs', {
      title: title,
      tasks: reply
    })
  })
})

// Start
app.listen(3000)
console.log("Server started on port 3000.")

module.exports = app
