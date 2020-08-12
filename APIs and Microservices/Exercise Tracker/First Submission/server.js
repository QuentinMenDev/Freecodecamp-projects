const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const moment = require('moment')

const cors = require('cors')

const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.connect('mongodb+srv://admin:tunbouffonvv@freecodecamp-course-zzf9t.gcp.mongodb.net/test?retryWrites=true&w=majority')

const logSchema = new Schema({
  description: String,
  duration: Number,
  date: Date
})
const userSchema = new Schema({
  username: String,
  log: [logSchema]
})
const Log = mongoose.model('Log', logSchema)
const User = mongoose.model('User', userSchema)

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/exercise/new-user', (req, res) => {
  const newUser = new User({
    username: req.body.username
  })
  
  User.findOne({username: req.body.username}, (err, data) => {
    if(err) return console.error(err)
    
    if (data) {
      res.json('user already taken')
    } else {
      newUser.save((err, data) => {
        if (err) return console.error(err)
        res.json({username: req.body.username, _id: data._id})
      })
    }
  })
})
app.get('/api/exercise/users', (req, res) => {
  User.find().select("_id username").exec((err, data) => {
    if(err) return console.error(err)
    res.json(data)
  })
})
app.post('/api/exercise/add', (req, res) => {
  // check if user exists
  if (req.body.userId) {
    if (!req.body.description) {
      res.json('description is required')
    } else if (!req.body.duration) {
      res.json('duration is required')
    } else {
      User.findById({_id: req.body.userId}, (err, data) => {
        if(err) return console.error(err)

        if (data) {
          let newDate = req.body.date?moment(req.body.date).format("ddd MMM DD YYYY"):moment().format("ddd MMM DD YYYY")
          data.log.push({
            description: req.body.description,
            duration: parseInt(req.body.duration),
            date: newDate
          })

          data.save((err, resp) => {
            if (err) return console.error(err)
            
            let dataToSend = {
              _id: req.body.userId,
              username: data.username,
              description: req.body.description,
              duration: parseInt(req.body.duration),
              date: newDate.toString()
            }
            
            console.log(req.body, ' -- ', dataToSend)

            res.json(dataToSend)
          })
        } else {
          console.log('error')
          res.json('the user doesn\'t exist')
        }
      })
    }
  } else {
    res.json('you need to register the ID of a user')
  }
})
app.get('/api/exercise/log', (req, res) => {
  const queries = {
    id: req.query.userId,
    from: req.query.from,
    to: req.query.to,
    limit: req.query.limit
  }
  
  User.findById({_id: queries.id}, (err, data) => {
    if(err) console.error(err)

    
    if (data) {
      let newlog = data.log.filter(elem => {
        return (queries.from?(moment(elem.date).format() > moment(queries.from).format()):true && queries.to?(moment(elem.date).format() < moment(queries.to).format()):true)
      })
      if (queries.limit){
        newlog = newlog.splice(0, queries.limit)
      }

      let newData = {
        userId: data._id,
        username: data.username
      }
      newData.log = newlog
      newData.count = newlog.length
      
      res.json(newData)
    } else {
      res.json('the user doesn\t exist')
    }
    
  })
})

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
