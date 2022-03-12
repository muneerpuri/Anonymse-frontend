import React from 'react'
import classes from './FollowingList.module.css'
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import axios from "axios";
import { Link } from "react-router-dom";
function FollowingList({user}) {
 
  const { user: currentUser, dispatch } = React.useContext(AuthContext);

  const [loading,setLoading] = React.useState(false);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = React.useState([]);
  React.useEffect(()=>{
    setLoading(true)
    const getFriends = async () => {
      try {
        const friendList = await axios.get("https://anonymse-backend.herokuapp.com/api/users/friends/" + user._id);
        setFriends(friendList.data);
        setLoading(false)
      } catch (err) {
        setLoading(false)
        console.log(err);
      }
    };
    getFriends();
  },[user])
  return (
    <div className={classes.parentBox}>

{friends.map((friend) => (
            <Link
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
            >
              <div className={classes.bodyItem}>
                <img
                  src={
                    friend.profilePicture
                      ? PF + friend.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                  className={classes.bodyItemImage}
                />
                <div className={classes.bodyItemName}>{friend.username}</div>
              </div>
            </Link>
          ))}


    </div>
  )
}

export default FollowingList