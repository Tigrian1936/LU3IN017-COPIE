import React, { useEffect } from 'react';
import MessageList from './MessageList';
import { useState } from 'react';
import axios from 'axios';
import GetUrl from './Url';
import {UserContext} from "./UserContext.jsx";
import {useContext} from 'react';
function UserProfile(props){

  const LoadingStates = {
    LOADING : "Loading",
    LOADED : "Loaded",
    IDLE : "Idle",
  };
  const connectedUser = useContext(UserContext)
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [dataLoadingState, setLoadingState] = useState(LoadingStates.IDLE);

  const getUserInfosFromDB = () =>{
    if(props.id === -1){
        setLoadingState(LoadingStates.LOADED);
        setUser({username: "User Deleted", id: -1})
        return;
    }
    axios.get(`/users/${props.id}`, )
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
  const [upToDate, setUpToDate] = useState(false);

  useEffect(() => {
    setLoadingState(LoadingStates.LOADING)
    getUserInfosFromDB();
    setUpToDate(false)}, [upToDate, props.id]
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
        <label className="forum-body-page-header">{user.username} </label> 
        <MessageList messages = {messages} setUpToDate = {setUpToDate} setDisplay = {props.setDisplay} setDisplayDataId = {props.setDisplayDataId}/>
    </div>

  }
  </div>
)};

export default UserProfile;