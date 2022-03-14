import React from 'react'
import classes from './MobileSearchBox.module.css'
import axios from 'axios'
import { useHistory } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { Search ,Close} from "@material-ui/icons";
import { CircularProgress } from "@material-ui/core";
import {Link} from 'react-router-dom'
function MobileSearchBox() {
  const history = useHistory();
const { showSearchMenu ,dispatch} = React.useContext(AuthContext);
  const [searchTerm,setSearchTerm] =React.useState('')
  const [data,setData]=React.useState([]) 
  const [loading, setLoading] = React.useState(false);
  React.useEffect(()=>{
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_BACKEND}/api/users/search?name=${searchTerm}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((e) => setLoading(false));

},[searchTerm]) 
  return (
    <div className={classes.searchBoxContainer}>
  
    <div className={classes.searchBox}>
            <Search className={classes.searchIcon} />
            <input
              className={classes.inputSearch}
              type="text"
              readOnly={loading}
              value={searchTerm}
              placeholder="Search"
              onChange={(e)=>{
                if (!loading) {
                  setSearchTerm(e.target.value);
                } else {
                  e.preventDefault();
                }
              }}
            />
            <span onClick={()=>{ dispatch({type:"SETSHOWSEARCHMENU",payload:!showSearchMenu})}}><Close className={classes.searchIcon} /></span>
          </div>
          <div>

          {loading ? (
             <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}> <CircularProgress color="black" size={20} /></div>
            ) : (
              data.length? data.map((e)=>{
                return  <div className={classes.searchItem} onMouseDown={()=>{
                    history.push(`/profile/${e.username}`)
                    dispatch({type:"SETSHOWSEARCHMENU",payload:!showSearchMenu})
                }}>
                  <div className={classes.avatar}>
                    <img src="https://cdn.landesa.org/wp-content/uploads/default-user-image.png" className={classes.avatarImg} alt="avatar"/>
                  </div>
                  <div className={classes.username}>{e.username}</div>
                </div>
              }):<div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>No results to view ☹...</div>
            )}
          </div>
         
          </div>
  )
}

export default MobileSearchBox