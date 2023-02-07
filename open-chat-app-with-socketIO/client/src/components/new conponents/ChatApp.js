import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io();

let images = [
  "https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?cs=srgb&dl=pexels-pixabay-268533.jpg&fm=jpg",
  "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8&w=1000&q=80",
  "https://cdn.pixabay.com/photo/2014/02/27/16/10/flowers-276014__340.jpg",
];

let userImages = {};

function assignImage(user) {
  if (userImages[user]) {
    return userImages[user];
  }
  let imageIndex = Math.floor(Math.random() * images.length);
  userImages[user] = images[imageIndex];
  return images[imageIndex];
}

function ChatRoom() {
  const [name, setName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    let user = prompt("Please enter your name: ");
    while (!user) {
      user = prompt("Please enter your name: ");
    }
    setName(user);
    setUserImage(assignImage(user));
    socket.emit("username", {
      user: name,
      userImage: userImage,
    });
  }, []);

  useEffect(() => {
    socket.on("username", (userinfo) => {
      userinfo.status = "online";
      setAllUsers([...allUsers, userinfo]);
    });
  });

  console.log(allUsers)

  return (
    <div>
      <ul id="user-list">
        {allUsers.map((user, index) => (
          <li key={index}>
            <span>
              {user.user} ({user.status}) :{" "}
              <img src={user.userImage} alt="user image" />
            </span>
          </li>
        ))}
      </ul>
      <button id="play_button" onClick={() => console.log("Please wait for more users to join.")}>
        Play
      </button>
    </div>
  );
}

export default ChatRoom;
