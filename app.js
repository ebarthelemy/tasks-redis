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

/**********/
/* Routes */
/**********/

// Get Tasks
app.get('/', (req, res) => {
  var title = "Task List"

  // LRANGE: Returns the specified elements of the list stored at key.
  client.lrange('tasks', 0, -1, (err, reply) => {
    res.render('index.ejs', {
      title: title,
      tasks: reply
    })
  })
})

// Add Task
app.post('/tasks/add', (req, res) => {
  let task = req.body.task

  // RPUSH: Insert all the specified values at the tail of the list stored at key.
  client.rpush('tasks', task, (err, reply) => {
    if (err) {
      console.log('err', err)
    }
    console.log("Task successfully added.")
    res.redirect('/')
  })
})

// Delete Task
app.post('/tasks/delete', (req, res) => {
  let tasksToDelete = req.body.tasks

  // LRANGE: Returns the specified elements of the list stored at key.
  client.lrange('tasks', 0, -1, (err, tasks) => {
    tasks.forEach((task) => {
      if (tasksToDelete.indexOf(task) > -1) {
        // LREM: Removes the first count occurrences of elements equal to value from the list stored at key.
        client.lrem('tasks', 0, task, () => {
          if (err) {
            console.log('err', err)
          }
        })
      }
    })
    console.log("Tasks successfully deleted.")
    res.redirect('/')
  })
})

// Start
app.listen(3000)
console.log("Server started on port 3000.")

module.exports = app
