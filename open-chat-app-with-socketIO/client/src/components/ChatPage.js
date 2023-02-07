import React, { useEffect, useState, useRef, useMemo } from 'react'
import ChatBar from './ChatBar'
import ChatBody from './ChatBody'
import ChatFooter from './ChatFooter'

const ChatPage = ({socket}) => { 
  const [messages, setMessages] = useState([])
  const [typingStatus, setTypingStatus] = useState("")
  const lastMessageRef = useRef(null)
  const [userImage, setUserImage] = useState([])

useEffect(()=>{
  let images = [
    "https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?cs=srgb&dl=pexels-pixabay-268533.jpg&fm=jpg",
    "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8&w=1000&q=80",
    "https://cdn.pixabay.com/photo/2014/02/27/16/10/flowers-276014__340.jpg",
  ];

  let imageIndex = Math.floor(Math.random() * images.length);
console.log('check',imageIndex)

  setUserImage(imageIndex)

},[])

useEffect(()=> {
  socket.on("userImage", data => setMessages([...userImage, data]))
  return () => {
    socket.off("userImage")
  }
}, [socket, userImage])
  
  useEffect(()=> {
    socket.on("messageResponse", data => setMessages([...messages, data]))
    return () => {
      socket.off("messageResponse")
    }
  }, [socket, messages])

  useEffect(()=> {
    socket.on("userImage", data => setUserImage([...userImage, data]))
    return () => {
      socket.off("userImage")
    }
  }, [socket, userImage])

  useEffect(()=> {
    socket.on("typingResponse", data => setTypingStatus(data))
    return () => {
      socket.off("typingResponse")
    }
  }, [socket])

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({behavior: 'smooth'})
  }, [messages])

  const memoizedTypingStatus = useMemo(() => typingStatus, [typingStatus])
  const memoizedMessages = useMemo(() => messages, [messages])

  return (
    <div className="chat">
      <ChatBar socket={socket} />
      <div className='chat__main'>
        <ChatBody messages={memoizedMessages} typingStatus={memoizedTypingStatus} lastMessageRef={lastMessageRef} />
        <ChatFooter socket={socket} />
      </div>
    </div>
  )
}

export default ChatPage
