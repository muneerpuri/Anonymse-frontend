import classes from "./profile.module.css";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router";
import axios from "axios";
import { Create } from "@material-ui/icons";
import { useParams } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import FollowMessageBox from "../../components/FollowMessageBox/FollowMessageBox";
import { CircularProgress } from "@material-ui/core";
import FollowingList from "../../components/FollowingList/FollowingList";
import FollowersList from "../../components/FollowersList/FollowersList";
import { useToasts } from "react-toast-notifications";
export default function Profile() {

  const history = useHistory();
  const { user: currentUser ,dispatch} = useContext(AuthContext);
  const [fileImg, setFileImg] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const username = useParams().username;
  const [activeTab, setActiveTab] = useState(0);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);
  let fileToUpload = null;
  const { addToast } = useToasts();
  useEffect(() => {
    setRefetch(false);
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setUser(res.data);
    };
    fetchUser();
  }, [username, refetch]);

  const updateProfileImage = async (e) => {
    if (fileToUpload) {
      const newPost = {
        userId: user._id,
      };
      if (fileToUpload) {
        const data = new FormData();
        const fileName = Date.now() + fileToUpload.name;
        data.append("name", fileName);
        data.append("file", fileToUpload);
        newPost.profilePicture = fileName;
        try {
          await axios.post("/upload", data);
        } catch (err) {}
      }
      setLoading(true);
      try {
        await axios.put(`/users/${currentUser._id}`, newPost);
        addToast("Picture updated!", { appearance: "success" });
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    } else {
      addToast("Please choose a picture!", { appearance: "error" });
    }
  };
  return (
    <>
      <div className={classes.profile}>
        <div className={classes.profileWrapper}>
          <div className={classes.profileBox}>
            <div className={classes.profileAvatar}>
              <div className={classes.avatarImgBox}>
                {loading ? (
                  <CircularProgress size={20} color="white" />
                ) : (
                  <img
                    src={
                      fileImg
                        ? URL.createObjectURL(fileImg)
                        : user.profilePicture
                        ? PF + user.profilePicture
                        : "https://cdn.landesa.org/wp-content/uploads/default-user-image.png"
                    }
                    className={classes.avatarImg}
                    alt="avatar"
                  />
                )}
                {currentUser.username === user.username && (
                  <label htmlFor="file1" className={classes.pencil}>
                    <span className="shareOptionText">
                      <Create />
                    </span>
                    <input
                      style={{ display: "none" }}
                      type="file"
                      id="file1"
                      accept=".png,.jpeg,.jpg"
                      onChange={(e) => {
                        fileToUpload = e.target.files[0];
                        setFileImg(e.target.files[0]);
                        updateProfileImage();
                      }}
                    />
                  </label>
                )}
              </div>
              <div className={classes.userInfo}>
                <div className={classes.username}>
                  {user ? user.username : null}
                </div>
                <div className={classes.logoutLink} onClick={()=>{
                  
                  dispatch({type:"LOGOUT"})
                  history.push('/login')
                  }}>
                      Logout
                </div>
              </div>
            </div>
            <div className={classes.infoModule}>
              <div className={classes.infoStats}>
                <div
                  className={classes.stat}
                  onClick={() => {
                    setActiveTab(0);
                  }}
                >
                  <div className={classes.number}>
                    {user.count ? user.count : 0}
                  </div>
                  <div className={classes.Name}>Posts</div>
                </div>
                <div
                  className={classes.stat}
                  onClick={() => {
                    setActiveTab(1);
                  }}
                >
                  <div className={classes.number}>
                    {user.followers ? user.followers.length : 0}
                  </div>
                  <div className={classes.Name}>Followers</div>
                </div>{" "}
                <div
                  className={classes.stat}
                  onClick={() => {
                    setActiveTab(2);
                  }}
                >
                  <div className={classes.number}>
                    {user.followings ? user.followings.length : 0}
                  </div>
                  <div className={classes.Name}>Followings</div>
                </div>
              </div>
              <FollowMessageBox user={user} />
            </div>
          </div>
        </div>
      </div>
      <div className={classes.dataBoxComponent}>
        {activeTab === 0 && (
          <Feed username={username} setRefetch={setRefetch} refetch={refetch} />
        )}

        {activeTab === 1 && <FollowersList user={user} />}

        {activeTab === 2 && <FollowingList user={user}/>}
      </div>
    </>
  );
}
