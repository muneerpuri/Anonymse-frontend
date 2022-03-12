import "./messenger.css";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import { CircularProgress } from "@material-ui/core";
import React from "react";
export default function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [activeTab,setActiveTab] = useState(0);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const [activeChatUser,setActiveChatUser] = useState('')
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();
  const [friends, setFriends] = React.useState([]);
  const [showSearchBox, setShowSearchbox] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [chatStarted,setChatStarted] = React.useState(false)
  const getFriends = async (val) => {
    setLoading(true);
    try {
      const friendList = await axios.get(
        `https://anonymse-backend.herokuapp.com/api/users/messengerchat/` + user._id + `?name=${val}`
      );
      setFriends(friendList.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  const chatUserId = async (val)=>{
    setLoading(true);
    try {
      const res = await axios.get(`https://anonymse-backend.herokuapp.com/api/users/chat/${val}`);
      setLoading(false);
      setActiveChatUser(res.data)
      console.log(res.data)
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }
  const setConversationRevealed = async (val)=>{
    setLoading(true)
    try{
      let res =await axios.put(`https://anonymse-backend.herokuapp.com/api/conversations/${val}`, {
        revealed: true
      })
      setCurrentChat(res.data)
      setLoading(false)

    }catch (err) {
      console.log(err);
      setLoading(false)
    }
  }
  const startAnewConversation = async (val)=>{
    
    let userObj={
      senderId:user._id,
      receiverId:val
    }
    setLoading(true);
    try {
      const res = await axios.post("https://anonymse-backend.herokuapp.com/api/conversations", userObj);
      setLoading(false);
      setActiveTab(2)
      setChatStarted(true)
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
    
  }
  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat,chatStarted]);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        user.followings.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [user,activeTab, currentChat,chatStarted]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("https://anonymse-backend.herokuapp.com/api/conversations/" + user._id);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id,activeTab]);

  useEffect(() => {
    setChatStarted(false)
    const getMessages = async () => {
      try {
        const res = await axios.get("https://anonymse-backend.herokuapp.com/api/messages/" + currentChat?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat,activeTab,chatStarted]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post("https://anonymse-backend.herokuapp.com/api/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };
  const askForIdentity = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: "Who are you? reveal yourself!!",
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: "Who are you? reveal yourself!!",
    });

    try {
      const res = await axios.post("https://anonymse-backend.herokuapp.com/api/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };
  const shownIdentityMessage = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: "I just reveled myself, refresh your page",
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: "I just reveled myself, refresh your page",
    });

    try {
      const res = await axios.post("https://anonymse-backend.herokuapp.com/api/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="messengerNav">
        <div className="messengerChatItem" style={activeTab===0?{background:"white",color:"black"}:null} onClick={()=>{
          setActiveTab(0)
        }}>Search Friend</div>
        <div className="messengerChatItem" style={activeTab===1?{background:"white",color:"black"}:null} onClick={()=>{
          setActiveTab(1)
        }}>Recent Chat</div>
      </div>
      {
        activeTab === 0? <div className="inputBox">
        <input
          placeholder="Search for friends"
          readOnly={loading}
          onFocus={()=>{
            setShowSearchbox(true)
          }}
          onBlur={()=>{
            setShowSearchbox(false)
          }}
          onChange={(e) => {
            getFriends(e.target.value);
          }}
          className="chatMenuInput"
        />
       {friends.length>0&& showSearchBox?
         <div className="resultBox">
    {loading?<div style={{display:"flex",justifyContent:"center",alignItems:"center"}}><CircularProgress size={30} color="black" /></div>   :  friends.map(el=>{
         return  <div className="searchItem" onMouseDown={()=>{
          startAnewConversation(el._id)
          chatUserId(el._id)
      }}>
        <div className="avatar">
          <img src={el.profilePicture?el.profilePicture:"https://cdn.landesa.org/wp-content/uploads/default-user-image.png"} className="avatarImg" alt="avatar"/>
        </div>
        <div className="username">{el.username}</div>
      </div>
       })}
       
         </div>:null}
      </div>:null
      }

      {
        activeTab===1? <div className="chatMenuWrapper">
           
        {conversations.map((c) => (
          <div onClick={() => {
            setActiveTab(3)
            setCurrentChat(c)
            let userId = c.members.filter(e=>e !== user._id)
            chatUserId(userId)
            }}>
            <Conversation conversation={c} currentUser={user} />
          </div>
        ))}
      </div>:null
      }
{console.log(currentChat)}
      {
        activeTab===3? <div className="chatBox">
        <div className="chatBoxWrapper">
          <div className="userChat">{currentChat.revealed || currentChat.members[0] === user._id?activeChatUser?activeChatUser:null:"Anonymse"}</div>
          {currentChat ? (
            <>
              <div className="chatBoxTop">
                {messages.map((m) => (
                  <div ref={scrollRef}>
                    <Message message={m} own={m.sender === user._id} />
                  </div>
                ))}
              </div>
              <div className="chatBoxBottom">
                <div className="chatMessageInput">

                <textarea
                  className="chatMessageInput"
                  placeholder="write something..."
                  onChange={(e) => setNewMessage(e.target.value)}
                  value={newMessage}
                  ></textarea>
                  {currentChat.revealed?null:
                  currentChat.members[0] === user._id ?<span className="mainQuestionText" onClick={()=>{
                    setConversationRevealed(currentChat._id);
                    shownIdentityMessage();
                  }}>{loading?<CircularProgress size={10} color="black"/>:`Reveal yourself`}</span>:<span className="mainQuestionText" onClick={askForIdentity}>Ask for identity!</span>
                  
                  }
                  </div>
                <button className="chatSubmitButton" onClick={handleSubmit}>
                  Send
                </button>
              </div>
            </>
          ) : (
            <span className="noConversationText">
              Open a conversation to start a chat.
            </span>
          )}
        </div>
      </div>:null
      }
    </>
  );
}
