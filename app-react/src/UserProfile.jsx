import React, { useEffect } from 'react';
import ClickableUserProfile from './ClickableUserProfile';
import MessageList from './MessageList';
import { useState } from 'react';
import axios from 'axios';
import GetUrl from './Url';

function UserProfile(props){

  const LoadingStates = {
    LOADING : "Loading",
    LOADED : "Loaded",
    IDLE : "Idle",
  };

  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [dataLoadingState, setLoadingState] = useState(LoadingStates.IDLE);

  const getUserInfosFromDB = () =>{
    if(props.id === -1){
        setLoadingState(LoadingStates.LOADED);
        setUser({username: "User Deleted", id: -1})
        return;
    }
    axios.get(`${GetUrl()}/users/${props.id}`)
    .then((response) => {
      setLoadingState(LoadingStates.LOADED);
      setMessages(response.data.messages);
      setUser(response.data.user)
    })
    .catch((error) => {
      setLoadingState(LoadingStates.IDLE);
      console.log(error);
    });
  }


  useEffect(() => {
    setLoadingState(LoadingStates.LOADING)
    getUserInfosFromDB();}, []
  );
  if(dataLoadingState === LoadingStates.LOADING){
    return (<div className="user-profile">
      <div className="profile-details">
        <label className="username">Loading... </label> 
      </div>  
    </div>)
  }
  if(dataLoadingState === LoadingStates.IDLE){
    return (<div className="user-profile">
      <div className="profile-details">
        <label className="username">Error while loading data </label> 
      </div>  
    </div>)
  }
  
  return (
  <div className="user-profile">
  {
    <div className="profile-details">
        <label className="username">{user.username} </label> 
        <MessageList messages = {messages} setDisplay = {props.setDisplay} setDisplayDataId = {props.setDisplayDataId}/>
    </div>  
    


    //Pseudo
    //Photo
    //Date d'inscription
    //Réponse
    //Fil de discu

  }
  </div>
)};

export default UserProfile;