const socket = io('/')

const myPeer = new Peer()
const peers = {}

const videoGrid = document.getElementById('video-grid')
const myVideoEl = document.createElement('video')
myVideoEl.setAttribute("playsinline", true);  // for IOS
myVideoEl.muted = true


navigator.mediaDevices
.getUserMedia({
    audio: true,
    video: ( isMobile() ) ? { facingMode: { exact: "environment" } } : true
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
    video.setAttribute("playsinline", true);  // for IOS

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


function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
