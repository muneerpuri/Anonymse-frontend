import "./messenger.css";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import { CircularProgress } from "@material-ui/core";

import {Delete} from '@material-ui/icons'
import React from "react";
export default function Messenger() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
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
  const [messageChange,setMessageChange] = React.useState(false)
  const [entireChatLoad,setEntireChatLoad] = React.useState(false)
  const [deleteChatId, setDeleteChatId] = React.useState(null);
  const [refresh,setRefreshLoading] = React.useState(false)
  const getFriends = async (val) => {
    setLoading(true);
    try {
      const friendList = await axios.get(
        `${process.env.REACT_APP_BACKEND}/api/users/messengerchat/` + user._id + `?name=${val}`
      );
      setFriends(friendList.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(async()=>{
    if(deleteChatId){

      setLoading(true)
      try{
        let res =await axios.delete(`${process.env.REACT_APP_BACKEND}/api/conversations/single/${deleteChatId}/${user._id}`)
        setConversations(res.data);
        setLoading(false)
        setEntireChatLoad(false)
      }catch (err) {
        console.log(err);
        setLoading(false)

        setEntireChatLoad(false)
      }
      
      
    }

  },[deleteChatId])



  const chatUserId = async (val)=>{
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND}/api/users/chat/${val}`);
      setLoading(false);
      setActiveChatUser(res.data)
      console.log(res.data)
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }

  useEffect(async ()=>{
    setMessageChange(false)
    if(currentChat){
      setEntireChatLoad(true)
      try{
        let res =await axios.get(`${process.env.REACT_APP_BACKEND}/api/conversations/single/${currentChat._id}`)
        setCurrentChat(res.data)
        setEntireChatLoad(false)
      }catch (err) {
        console.log(err);

        setEntireChatLoad(false)
      }
      
      
    }
  },[messageChange])


 

  async function updateChatData(){
    if(currentChat){

      setRefreshLoading(true)
      try{
        let res =await axios.get(`${process.env.REACT_APP_BACKEND}/api/conversations/single/${currentChat._id}`)
        setCurrentChat(res.data)
        setRefreshLoading(false)
      }catch (err) {
        console.log(err);
        setRefreshLoading(false)
      }
      
      
    }
  }


  async function callRefreshChat(){
    if(currentChat){

     
      
      
    }
  }
  const startAnewConversation = async (val)=>{
    
    let userObj={
      senderId:user._id,
      receiverId:val
    }
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND}/api/conversations`, userObj);
      await setLoading(false);
      await setCurrentChat(res.data[0])
      setChatTab()
      await setChatStarted(true)
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
    
  }
  async function setChatTab(){

    await setActiveTab(3)
  }
  useEffect(async () => {
    socket.current = io("https://anonymse-chat-backend.herokuapp.com/",{ transports : ['websocket'] });
    socket.current.on("getMessage",async (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });

      if(data.text === "I just reveled myself, [Press 'Refresh'  to find out who am I!!]" || data.text === "I just reveled myself, [Press 'Refresh' to find out who am I!!]"){
        setMessageChange(true)
      }
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);

  }, [arrivalMessage, activeTab,currentChat,chatStarted]);

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
        const res = await axios.get(`${process.env.REACT_APP_BACKEND}/api/conversations/` + user._id);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id,activeTab]);

  useEffect(async () => {
    setChatStarted(false)
    setLoading(true)
    const getMessages = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND}/api/messages/` + currentChat?._id);
        setMessages(res.data);
        setLoading(false)
      } catch (err) {
        setLoading(false)
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
      const res = await axios.post(`${process.env.REACT_APP_BACKEND}/api/messages`, message);
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
      text: "I just reveled myself, [Press 'Refresh'  to find out who am I!!]",
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: "I just reveled myself, [Press 'Refresh'  to find out who am I!!]",
    });

    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND}/api/messages`, message);
      setMessages([...messages, res.data]);
      setNewMessage("");
      setLoading(true)
    try{
      let res =await axios.put(`${process.env.REACT_APP_BACKEND}/api/conversations/${currentChat._id}`, {
        showRevealButton: true
      })
      setCurrentChat(res.data)
      setLoading(false)

    }catch (err) {
      console.log(err);
      setLoading(false)
    }
    } catch (err) {
      console.log(err);
    }
  };

  const setShowRevealedButtonToTrue =async ()=>{
    
  }
  const shownIdentityMessage = async () => {
   
    const message = {
      sender: user._id,
      text: "I just reveled myself, [Press 'Refresh' to find out who am I!!]",
      conversationId: currentChat._id,
    };
    
    const receiverId = currentChat.members.find(
      (member) => member !== user._id
      );
      
      socket.current.emit("sendMessage", {
        senderId: user._id,
        receiverId,
        text:"I just reveled myself, [Press 'Refresh' to find out who am I!!]",
      });
      
      try {

        const res = await axios.post(`${process.env.REACT_APP_BACKEND}/api/messages`, message);
        setMessages([...messages, res.data]);
        setNewMessage("");
        setLoading(true)
        try{
          let res =await axios.put(`${process.env.REACT_APP_BACKEND}/api/conversations/${currentChat._id}`, {
            revealed: true
          })
          setCurrentChat(res.data)
          setLoading(false)
    
        }catch (err) {
          console.log(err);
          setLoading(false)
        }
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
          <img src={el.profilePicture?PF+el.profilePicture:"https://cdn.landesa.org/wp-content/uploads/default-user-image.png"} className="avatarImg" alt="avatar"/>
        </div>
        <div className="username">{el.username}</div>
      </div>
       })}
       
         </div>:null}
      </div>:null
      }

      {
        activeTab===1?loading?<div style={{display:"flex",justifyContent:"center",alignItems:"center"}}><CircularProgress size={10} color="black"/></div> : <div className="chatMenuWrapper">
           
        {conversations.map((c) => (
          <div style={{display:"flex",justifyContent:"flex-start",alignItems:"center"}}>
          <div  onClick={() => {
            setActiveTab(3)
            setCurrentChat(c)
            let userId = c.members.filter(e=>e !== user._id)
            chatUserId(userId)
            }}>
            <Conversation setDeleteChatId={setDeleteChatId} conversation={c} currentUser={user} />
        
          </div>
          <div style={{display:"flex",justifyContent:"flex-start",alignItems:"center"}}>
                <span  onClick={()=>{
        setDeleteChatId(c._id)
      }} style={{display:"flex",justifyContent:"center",alignItems:"center"}}><Delete style={{color:"red"}}/></span>
          </div>
          </div>
        ))}
      </div>:null
      }
{console.log(currentChat)}
      {
        activeTab===3? loading || entireChatLoad?<div style={{display:"flex",justifyContent:"center",alignItems:"center"}}><CircularProgress size={10} color="black"/></div> :<div className="chatBox">
        <div className="chatBoxWrapper">
         <div className="userChatParent"> <div className="userChat">{currentChat?.revealed || currentChat?.members[0] === user?._id?activeChatUser?activeChatUser:null:"Anonymse"}</div> <div>{refresh?<CircularProgress size={10} color="black"/>:<button onClick={()=>{
           updateChatData()
         }} style={{border:'none',background:'white',color:'black',padding:"10px",cursor:"pointer"}}>Refresh</button>}</div></div>
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
                  {entireChatLoad?<CircularProgress size={10} color="black"/>:currentChat?.revealed?null:
                  currentChat.members[0] === user._id ?currentChat.showRevealButton?<span className="mainQuestionText" onClick={()=>{
                    shownIdentityMessage()
                    
                  }}>{loading?<CircularProgress size={10} color="black"/>:`Reveal yourself`}</span>:null:<span className="mainQuestionText" onClick={askForIdentity}>Ask for identity!</span>
                  
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
