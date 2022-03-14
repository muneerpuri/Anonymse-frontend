import classes from "./topbar.module.css";
import { Search, AccountBox, Email } from "@material-ui/icons";
import { NavLink } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import axios from 'axios';
import { useHistory } from "react-router";
export default function Topbar() {
  const history = useHistory();

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user, dispatch, showSearchMenu } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [showSearchResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://anonymse-backend.herokuapp.com/api/users/search?name=${searchTerm}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((e) => setLoading(false));
  }, [searchTerm]);

  return (
    <div className={classes.topbarContainer}>
      <div className={classes.navLogo} onClick={()=>history.push('/')}>Anonymse</div>
      <div className={classes.parentSearchBox}>
        <div className={classes.searchBox}>
          <Search className={classes.searchIcon} />
          <input
            className={classes.inputSearch}
            type="text"
            value={searchTerm}
            placeholder="Search"
            readOnly={loading}
            onChange={(e) => {
              if (!loading) {
                setSearchTerm(e.target.value);
              } else {
                e.preventDefault();
              }
            }}
            onFocus={() => {
              setShowResults(true);
            }}
            onBlur={() => {
              setShowResults(false);
            }}
          />
        </div>
        {showSearchResults && (
          <div className={classes.searchItemBox}>
            {loading ? (
             <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}> <CircularProgress color="black" size={20} /></div>
            ) : (
              data.length > 0? data.map((e)=>{
                return <div className={classes.searchItem} onMouseDown={()=>{
                  history.push(`/profile/${e.username}`)
                }}>
                  <div className={classes.avatar}>
                    <img src={e.profilePicture?PF+e.profilePicture:"https://cdn.landesa.org/wp-content/uploads/default-user-image.png"} className={classes.avatarImg} alt="avatar"/>
                  </div>
                  <div className={classes.username}>{e.username}</div>
                </div>
              }):<div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>No results to view ☹...</div>
            )}
          </div>
        )}
      </div>
      <div className={classes.navIcons}>
        <span
          onClick={() => {
            dispatch({ type: "SETSHOWSEARCHMENU", payload: !showSearchMenu });
          }}
          className={classes.hideIcon}
        >
          <Search
            className={classes.navIconsImageSearch}
            style={{ fontSize: "35px", margin: "0 10px" }}
          />
        </span>
        <NavLink
          to={`/messenger`}
          className={classes.navIconsLinks}
          activeClassName={classes.activeLink}
        >
          <Email
            title="chat"
            className={classes.navIconsImage}
            style={{ fontSize: "35px" }}
          />
        </NavLink>
        <NavLink
          to={`/profile/${user.username}`}
          className={classes.navIconsLinks}
          activeClassName={classes.activeLink}
        >
          <AccountBox
            title="profile"
            className={classes.navIconsImage}
            style={{ fontSize: "35px" }}
          />
        </NavLink>
      </div>
    </div>
  );
}
