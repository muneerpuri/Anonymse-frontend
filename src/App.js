import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Messenger from "./pages/messenger/Messenger";
import Topbar from "./components/topbar/Topbar";
import React from 'react'
import MobileSearchBox from "./components/MobileSearchBox/MobileSearchBox";


function App() {
  const { user } = useContext(AuthContext);
  const { showSearchMenu } = React.useContext(AuthContext);


  function ComponentWithNavbar(props){
    return(
      <>
      <Topbar />
      {showSearchMenu ? <MobileSearchBox />:<props.component/>}
  
      </>
    )
  }


  return (
    <Router>
      <Switch>
        <Route exact path="/"  render={(props) => {
          return (
            user ? <ComponentWithNavbar  component={Home} {...props}/> : <Register />
          );
        }}/>
         
        <Route path="/login">{user ? <Redirect to="/" /> : <Login />}</Route>
        <Route path="/register">
          {user ? <Redirect to="/" /> : <Register />}
        </Route>
        <Route path="/messenger" render={(props) => {
          return (
            user ?  <ComponentWithNavbar  component={Messenger} {...props}/> : <Redirect to="/" />
          );
        }}/>
        <Route path="/profile/:username" render={(props) => {
          return (
            user ?  <ComponentWithNavbar  component={Profile} {...props}/> : <Login />
          );
        }}/>
      </Switch>
    </Router>
  );
}

export default App;
