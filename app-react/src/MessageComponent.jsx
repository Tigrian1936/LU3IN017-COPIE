import React from 'react';
import ClickableUserProfile from './ClickableUserProfile';
import { useState, useEffect } from 'react';
import axios from 'axios';

import {UserContext} from "./UserContext.jsx";
import {useContext} from 'react';
/**
 * Renders a message component.
 *
 * @param {Object} props - The component props.
 * @param {number} props.user_id - The ID of the user associated with the message.
 * @param {string} props.text - The text content of the message.
 * @param {string} props.date - The date of the message.
 * @param {Function} props.switchToProfile - A function to switch to the user's profile.
 * @param {Function} props.setUpToDate - A function to update the message list.
 * @returns {JSX.Element} The rendered message component.
 */
function MessageComponent (props){

  /**
   * Represents the loading states of a component.
   * @enum {string}
   */
  const LoadingStates = {
    LOADING : "Loading",
    LOADED : "Loaded",
    IDLE : "Idle",
  };
  const [user, setUser] = useState(null);
  const [dataLoadingState, setLoadingState] = useState(LoadingStates.IDLE);
  const connectedUser = useContext(UserContext);
  const id = props.user_id;


  /**
   * Fetches user information from the database based on the provided id.
   * If the id is 0, sets the user as the server and sets the loading state as LOADED.
   * If the user is not found in the database, sets the user as "User Deleted" with id -1.
   * Otherwise, sets the user with the retrieved information and sets the loading state as LOADED.
   * If an error occurs during the API call, handles the error accordingly.
   */
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

  /**
   * Deletes a message in the database
   */
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
      {(connectedUser.is_admin || id === connectedUser.id) && id !== 0 ? <button onClick={evt => deleteMessage()}>Delete</button> : null}
      <span className="message-date">{new Date(props.date).toLocaleDateString()}</span>  
    </div> 
  </div>);
}

export default MessageComponent;