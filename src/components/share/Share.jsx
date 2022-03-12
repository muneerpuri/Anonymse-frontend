import "./share.css";
import {
  AddPhotoAlternate,
  Cancel,
} from "@material-ui/icons";
import { useContext,  useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import {  useToasts } from 'react-toast-notifications';

export default function Share() {
  const { addToast } = useToasts();
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [desc,setDesc] = useState("");
  const [file, setFile] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    if(!desc){
      addToast("Post can't be empty!", { appearance: 'error' });
    }else{

      const newPost = {
        userId: user._id,
        desc: desc,
      };
      if (file) {
        const data = new FormData();
        const fileName = Date.now() + file.name;
        data.append("name", fileName);
        data.append("file", file);
        newPost.img = fileName;
        try {
          await axios.post("/upload", data);
        } catch (err) {}
      }
      try {
        await axios.post("/posts", newPost);
        window.location.reload();
      } catch (err) {}
    }

  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
          />
          <input
            placeholder={"What's in your mind " + user.username + "?"}
            className="shareInput"
            value={desc}
            onChange={(e)=>{
              setDesc(e.target.value)
            }}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file2" className="shareOption">
              <AddPhotoAlternate htmlColor="black" style={{fontSize:"32px"}} className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file2"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
          </div>
          <button className="shareButton" type="submit">
            Share
          </button>
        </form>
      </div>
    </div>
  );
}
