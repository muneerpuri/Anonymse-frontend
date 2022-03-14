import React from 'react'
import classes from './FollowMessageBox.module.css'
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";

import { useHistory } from "react-router";

function FollowMessageBox({user}) {
  const history = useHistory()
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(false);
  const [loading,setLoading] = useState(false);
  console.log(friends)
  useEffect(() => {
    if(currentUser.followings.includes(user?._id)){
      setFollowed(true)
    }
    const getFriends = async () => {
      try {
        const friendList = await axios.get("https://muneer-cors.herokuapp.com/https://anonymse-backend.herokuapp.com/api/users/friends/" + user._id);
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user]);

  const handleClick = async () => {
    setLoading(true)
    try {
      if (followed) {
        await axios.put(`https://muneer-cors.herokuapp.com/https://anonymse-backend.herokuapp.com/api/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
        setLoading(false)
      } else {
        await axios.put(`https://muneer-cors.herokuapp.com/https://anonymse-backend.herokuapp.com/api/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
        setLoading(false)
      }
      setFollowed(!followed);
    } catch (err) {
    }
  };


  return(
      <>
    {user.username !== currentUser.username ?
    
    loading?<div style={{display:'flex',justifyContent:"center",alignItems:"center"}}><CircularProgress  color="black" size={20}/></div>:
    <div className={classes.btnBox}>
        <button className={classes.follow} onClick={handleClick} >
            {followed?'Unfollow':'Follow'}
        </button>
        {followed? <button className={classes.message} onClick={()=>history.push('/messenger')}>
            Message
        </button>:null}
    </div>:null
        }
    

      </>
  )
}
export default FollowMessageBox