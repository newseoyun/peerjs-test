const socket = io('/')

const videoGrid = document.getElementById('video-grid')
const myVideoEl = document.createElement('video')
myVideoEl.muted = true

const myPeer = new Peer()
const peers = {}

navigator.mediaDevices
    .getUserMedia({
        video: true,
        audio: true,
    })
    .then((myStream) => {

        addVideoStream(myVideoEl, myStream)

        myPeer.on('call', (call) => {
            const userVideoEl = document.createElement('video')
            call.answer(myStream)
            call.on('stream', (userVideoStream) => {
                addVideoStream(userVideoEl, userVideoStream)
            })
        })

        socket.on('user-connected', (userId) => {
            console.log("user-connected : " + userId)
            connectToNewUser(userId, stream)
        })

    })

socket.on('user-disconnected', (userId) => {
    if (peers[userId]) peers[userId].close()
})

myPeer.on('open', (id) => { // 
    socket.emit('join-room', ROOM_ID, id)
})
// open = Whether the media connection is active (e.g. your call has been answered).

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')

    call.on('stream', (stream) => {
        addVideoStream(video, stream)
    })
    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call
}

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })

    videoGrid.append(video)
}