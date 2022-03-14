import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Feed({ username}) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    setRefetch(false)
    const fetchPosts = async () => {
      const res = username
        ? await axios.get("https://anonymse-backend.herokuapp.com/api/posts/profile/" + username)
        : await axios.get("https://anonymse-backend.herokuapp.com/apiposts/timeline/" + user._id);
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [username, user._id,refetch]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user.username) && <Share />}
        {posts.map((p) => (
          <Post key={p._id} setRefetch={setRefetch} post={p} />
        ))}
      </div>
    </div>
  );
}
