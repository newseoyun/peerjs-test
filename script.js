const socket = io('/')

const videoGrid = document.getElementById('video-grid')
const myVideoEl = document.createElement('video')
myVideoEl.id = "v1"
myVideoEl.muted = true
myVideoEl.setAttribute("playsinline", true);

const myPeer = new Peer()
const peers = {}


navigator.mediaDevices
    .getUserMedia({
        audio: true,
        video: true,
        facingMode: { exact: "environment" }
    })
    .then((myStream) => {

        addVideoStream(myVideoEl, myStream)

        myPeer.on('call', (call) => {
            const userVideoEl = document.createElement('video')
            userVideoEl.id = "v2"
            call.answer(myStream)
            call.on('stream', (userVideoStream) => {
                addVideoStream(userVideoEl, userVideoStream)
            })
        })

        socket.on('user-connected', (userId) => {
            console.log("user-connected : " + userId)
            connectToNewUser(userId, myStream)
        })

    })

socket.on('user-disconnected', (userId) => {
    if (peers[userId]) peers[userId].close()
})

myPeer.on('open', (id) => {
    console.log('join id : ', id)
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