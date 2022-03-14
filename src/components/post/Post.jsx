import "./post.css";
import { MoreVert,FavoriteBorder,Favorite } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";

export default function Post({ post ,setRefetch}) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);
  const [showDeleteMenu,setShowDeleteMenu] =useState(false)
  const [loading,setLoading] = useState(false)
  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND}/api/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  const likeHandler = () => {
    try {
      axios.put(`${process.env.REACT_APP_BACKEND}/api/posts/` + post._id + "/like", { userId: currentUser._id });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const DeletePostHandler = (id) =>{
    setLoading(true)
    try {
      axios.delete(`${process.env.REACT_APP_BACKEND}/api/posts/${id}`,{data: { userId: currentUser._id }}).then((_)=>{

        setLoading(false)
        setRefetch(true)
      })
      .catch((e)=>console.log(e))
    } catch (err) {setLoading(false)}

  }
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
           {currentUser._id === post.userId? <span onClick={()=>{
             setShowDeleteMenu(prev=>!prev)
           }}><MoreVert/></span>:""}
           {showDeleteMenu&&<div className="deleteMenu" onClick={()=>{
             DeletePostHandler(post._id)
           }}>
                {loading?<CircularProgress size={10} color="black"/>:  <div>Delete</div>}
           </div>}
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={PF + post.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
          {isLiked?<Favorite onClick={likeHandler} style={{color:"red",fontSize:"25px"}}/>:<FavoriteBorder onClick={likeHandler} style={{color:"black",fontSize:"25px"}}/>}
            <span className="postLikeCounter">{like} people like it</span>
          </div>
        </div>
      </div>
    </div>
  );
}
