import express from 'express'
import fs from 'fs'
import https from 'https'

const { v4: uuidV4 } = require('uuid')

const app = express()

const server = https.createServer(
    {
        key: fs.readFileSync(),
        cert: fs.readFileSync(),
        ca: fs.readFileSync(),
        requestCert: false,
        rejectUnauthorized: false
    }, 
    app
)

const io = require('socket.io')(server)


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.get('/', (req, res) => {
    res.redirect(`${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.io(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})

const PORT = 3000
server.listen(PORT)