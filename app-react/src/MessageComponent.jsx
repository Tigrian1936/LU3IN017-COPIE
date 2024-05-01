import React from 'react';
import ClickableUserProfile from './ClickableUserProfile';
import { useState, useEffect } from 'react';
import axios from 'axios';
import GetUrl from './Url';

function MessageComponent (props){
  const LoadingStates = {
    LOADING : "Loading",
    LOADED : "Loaded",
    IDLE : "Idle",
  };
  const [user, setUser] = useState(null);
  const [dataLoadingState, setLoadingState] = useState(LoadingStates.IDLE);

  const id = props.user_id;
  const getUserInfosFromDB = () =>{
    console.log(props.user_id);
    axios.get(`${GetUrl()}/users/${id}`)
    .then((response) => {
      setLoadingState(LoadingStates.LOADED);
      const user = response.data.user;
      if(user === null){
        setUser({username: "User Deleted", id: -1})
        return;
      }
      setUser({username: user.username, id: user._id})  
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
  return (<div className="message">
    <ClickableUserProfile connectedUser = {props.user} user = {user} switchToProfile = {props.switchToProfile}/>
    <p>{props.text}</p>
    <div className="message-details">
      <span className="user-id">{user.username}</span> 
      <span className="message-date">{props.date}</span>  
      <span className="message-index">{props.index + 1}</span>
    </div> 
  </div>);
}

export default MessageComponent;