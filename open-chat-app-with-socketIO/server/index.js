const express = require("express")
const app = express()
const cors = require("cors")
const http = require('http').Server(app);
const PORT = 4000
const socketIO = require('socket.io')(http, {
cors: {
origin: "http://localhost:3000"
}
});

app.use(cors())
let users = []

console.log(users)

socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`) 
socket.on("message", data => {
socketIO.emit("messageResponse", data)
})


socket.on("userImage", data => {
  // Find the user in the "users" array and update the image
  let user = users.find(user => user.socketID === socket.id)
  user.image = data.image
  socketIO.emit("userImage", data)
})

socket.on("typing", data => (
  socket.broadcast.emit("typingResponse", data)
))



socket.on("newUser", data => {
  let images = [
    "https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?cs=srgb&dl=pexels-pixabay-268533.jpg&fm=jpg",
    "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8&w=1000&q=80",
    "https://cdn.pixabay.com/photo/2014/02/27/16/10/flowers-276014__340.jpg",
  ];
  let userImages = {};

  let imageIndex = Math.floor(Math.random() * images.length);
  userImages = images[imageIndex];
  // Add the image field to the user object
  let user = {...data, image: userImages}
  users.push(user)
  socketIO.emit("newUserResponse", users)
})

socket.on('disconnect', () => {
  console.log('🔥: A user disconnected');
  users = users.filter(user => user.socketID !== socket.id)
  socketIO.emit("newUserResponse", users)
  socket.disconnect()
});
});

app.get("/api", (req, res) => {
res.json({message: "Hello"})
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});