import React from 'react';
import ClickableUserProfile from './ClickableUserProfile';
import { useState, useEffect } from 'react';
import axios from 'axios';
import GetUrl from './Url';
import {UserContext} from "./UserContext.jsx";
import {useContext} from 'react';
function MessageComponent (props){
  const LoadingStates = {
    LOADING : "Loading",
    LOADED : "Loaded",
    IDLE : "Idle",
  };
  const [user, setUser] = useState(null);
  const [dataLoadingState, setLoadingState] = useState(LoadingStates.IDLE);
  const connectedUser = useContext(UserContext);
  const id = props.user_id;
  const getUserInfosFromDB = () =>{
    if (id === 0) {
      setUser({username: "Server", id: 0})
      setLoadingState(LoadingStates.LOADED);
      return;
    }
    axios.get(`/users/${id}`, )
    .then((response) => {
      setLoadingState(LoadingStates.LOADED);
      const user = response.data.user;
      if(user === null){
        setUser({username: "User Deleted", id: -1})
        return;
      }
      setUser({username: user.username, id: user._id, approved: user.approved, is_admin: user.is_admin})
    })
    .catch((error) => {
      if(error.response === "User not found") {
        setUser({username: "User Deleted", id: -1})
      }
      else{
        setLoadingState(LoadingStates.IDLE);
        console.log(error);
      }
    });
  }


  useEffect(() => {
    setLoadingState(LoadingStates.LOADING)
    getUserInfosFromDB();}, []
  );
  if(dataLoadingState === LoadingStates.IDLE){
    return (<div className="message">
      <p>Error while loading user data</p>
    </div>)
  }
  if(dataLoadingState === LoadingStates.LOADING){
    return (<div className="message">
      <p>Loading... </p>
    </div>)
  }

  function deleteMessage() {
    axios.delete(`/messages/${props.id}`, ).then((response) => {
      if(response.status === 200){
          props.setUpToDate(true);
      }
    }).catch((error) => {
      alert(error.response.data.message);
    });
  }

  return (<div className="message">
    <ClickableUserProfile user = {user} switchToProfile = {props.switchToProfile} setUpToDate = {props.setUpToDate}/>
    <p>{props.text}</p>
    <div className="message-details">
      <span className="user-id">{user.username}</span> 
      <span className="message-date">{props.date}</span>  
      <span className="message-index">{props.index + 1}</span>
      {(connectedUser.is_admin || id === connectedUser.id) && id !== 0 ? <button onClick={evt => deleteMessage()}>Delete</button> : null}
    </div> 
  </div>);
}

export default MessageComponent;