import React from 'react'
import classes from './FollowersList.module.css'
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import axios from "axios";
import { Link } from "react-router-dom";


function FollowersList({user}) {
  const { user: currentUser, dispatch } = React.useContext(AuthContext);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = React.useState([]);
  const [loading,setLoading] = React.useState(false);
  React.useEffect(()=>{
    setLoading(true)
    const getFriends = async () => {
      try {
        const friendList = await axios.get("https://muneer-cors.herokuapp.com/https://anonymse-backend.herokuapp.com/api/users/followers/" + user._id);

    setLoading(false)
        setFriends(friendList.data);
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

export default FollowersList