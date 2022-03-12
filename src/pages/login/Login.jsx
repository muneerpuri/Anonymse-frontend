import { useContext, useRef } from "react";
import classes from "./login.module.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import { useHistory } from "react-router";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const history = useHistory();
  const { isFetching, dispatch } = useContext(AuthContext);

  const handleClick = (e) => {
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };

  return (
        <div className={classes.root}>
          <form className={classes.formBodyBox} onSubmit={handleClick}>
          <div className={classes.logoName}>Anonymse</div>
            <input
              placeholder="Email"
              type="email"
              required
              className={classes.inputField}
              ref={email}
            />
            <input
              placeholder="Password"
              type="password"
              required
              minLength="6"
              className={classes.inputField}
              ref={password}
            />
            <button className={classes.btn}  type="submit" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress color="white" size="20px" />
              ) : (
                "Log In"
              )}
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <button className={classes.btn} onClick={()=>{
              history.push('/register')
            }}>
              {isFetching ? (
                <CircularProgress color="white" size="20px" />
              ) : (
                "Create a New Account"
              )}
            </button>
          </form>
        </div>

  );
}
