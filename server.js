const express = require('express')
const fs = require('fs')
const https = require('https')
const { v4: uuidV4 } = require('uuid')

const app = express()

const server = https.createServer(
    {
        key: fs.readFileSync('ssl/privkey.pem'),
        cert: fs.readFileSync('ssl/cert.pem'),
        ca: fs.readFileSync('ssl/chain.pem'),
        requestCert: false,
        rejectUnauthorized: false
    }, 
    app
)

const io = require('socket.io')(server)


app.set('view engine', 'ejs')

app.use(express.static(__dirname))

app.get('/', (req, res) => {
    res.redirect(`${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', (socket) => {
    console.log("connected");
    socket.on('join-room', (roomId, userId) => {
        console.log("join-room. roomId " + roomId + " |  userId " + userId)
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId);

        socket.on('disconnect', () => {
            console.log("disconnected " + userId);
            socket.broadcast.to(roomId).emit('user-disconnected', userId)
        })
    })
})

console.log("running...");

const PORT = 3000
server.listen(PORT)
