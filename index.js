require("dotenv").config();
const Pusher = require("pusher")
const app = require("express")()
const bodyParser = require('body-parser')

const users = {}

const pusher = new Pusher({
  appId: "1188329",
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: "eu",
  useTLS: true
})

const usersArray = () => Object.entries(users).map(([user, pos]) => ({ user, pos }))  

const push = () => {
  pusher.trigger('my-channel', 'my-event', { users: usersArray() }) 
}

app.use('/', bodyParser.json())

app.use('/', (req, _, next) => {
  console.log(req.method, req.url, req.body)
  next()
})

app.get('/all', (_, res) => {
  res.json({ users: usersArray() })
})

app.post('/set', (req, res) => {
  const { user, pos } = req.body
  users[user] = pos
  push()
  res.sendStatus(200)
})

app.post('/unset', (req, res) => {
  delete users[req.body.user]
  push()
  res.sendStatus(200)
})

app.listen(process.env.PORT, '127.0.0.1', () => {
  console.log(`Listening on port ${process.env.PORT}...`)
})