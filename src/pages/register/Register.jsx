import axios from "axios";
import { useRef } from "react";
import classes from "./register.module.css";
import { useHistory } from "react-router";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useHistory();

  const handleClick = async (e) => {
    e.preventDefault();

    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axios.post("https://anonymse-backend.herokuapp.com/api/auth/register", user);
        history.push("/login");
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className={classes.root}>
      <form className={classes.formBodyBox} onSubmit={handleClick}>
      <div className={classes.logoName}>Anonymse</div>
        <input 
        className={classes.inputField} placeholder="Username" required ref={username} />
        <input 
        className={classes.inputField} placeholder="Email" required ref={email} type="email" />
        <input
          placeholder="Password"
          required 
          className={classes.inputField}
          ref={password}
          type="password"
          minLength="6"
        />
        <input
          placeholder="Password Again"
          required 
          className={classes.inputField}
          ref={passwordAgain}
          type="password"
        />
        <button className={classes.btn} type="submit">Sign Up</button>
        <div className={classes.orBox}>
          <div className={classes.lin}>&nbsp;</div>
          <div style={{color:'rgb(168,146,142)'}}>OR</div>
          <div className={classes.lin}>&nbsp;</div>

        </div>
        <button className={classes.btn} onClick={()=>{
          history.push('/login')
        }}>Log into Account</button>
      </form>
    </div>
  );
}
