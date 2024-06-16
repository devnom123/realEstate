import { useContext, useEffect, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format } from 'timeago.js'
import { SocketContext } from "../../context/SocketContext";

function Chat({chats}) {
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const handleOpenChat = async(id,receiver) => {
    try {
       const res = await apiRequest.get("/chat/"+id)
       console.log(res.data)
       setChat({...res.data,receiver})
    } catch (error) {
      console.log(error)
    }
    console.log("chat opened",chat)
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("text");
    try {
      const res = await apiRequest.post("/message/"+chat._id, {text})
      console.log(res.data)
      setChat({...chat, messages: [...chat.messages, res.data]})
      e.target.reset()
      socket.emit('sendMessage', {
        receiverId: chat.receiver._id,
        data: res.data
      })
    } catch (error) {
      console.log(error)
    }
  }
  
  useEffect(() => {
    const read = async() => {
      try {
        const res = await apiRequest.put("/chat/read/"+chat._id)
        console.log(res.data)
        setChat(res.data[0])
      } catch (error) {
        console.log(error)
      }
    }
    socket.on('getMessage', (data) => {
      console.log(data)
      if(chat._id.toString() === data.chatId.toString()){
        setChat({...chat, messages: [...chat.messages, data.message]})
        read()
      }
    })
  }, [chat, socket])

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {
          chats?.map(c=>(
            <div className="message" key={c._id} style={{
              backgroundColor: c.seenBy.includes(currentUser._id.toString()) ? 'white' : '#fecd514e'
            }}
            onClick = {()=>handleOpenChat(c._id, c.receiver)} 
            >
              <img
                src={ c.receiver.avatar || 'noavatar.jpg'}
                alt=""
              />
              <span>{c.receiver.username}</span>
              <p>{c.lastMessage}</p>
            </div>
          ))
        }
      </div>
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img
                src={chat.receiver.avatar || 'noavatar.jpg'}
                alt=""
              />
              {chat.receiver.username}
            </div>
            <span className="close" onClick={()=>setChat(null)}>X</span>
          </div>
          <div className="center">
            {
              chat.messages.map(m=>(
                <div className={'chatMessage'} style={{
                  alignSelf: m.user.toString() === currentUser._id.toString() ? 'flex-end' : 'flex-start',
                  textAlign: m.user.toString() === currentUser._id.toString() ? 'right' : 'left'
                }} key={m._id}
                >
                  <p>{m.message}</p>
                  <span>{format(m.createdAt)}</span>
                </div>
              ))
            }
          </div>
          <form className="bottom" onSubmit={handleSubmit}>
            <textarea name="text"></textarea>
            <button>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
