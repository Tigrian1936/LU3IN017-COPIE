import React from 'react';
import MessageList from './MessageList';
import ThreadMessageForm from './ThreadMessageForm';
import { useEffect } from 'react';
import axios from 'axios';

import { useState } from 'react';

/**
 * Represents a thread component.
 * @param {Object} props - The component props.
 * @param {function} props.setDisplay - The function to set the display.
 * @param {function} props.setDisplayDataId - The function to set the display data ID.
 * @param {string} props.id - The ID of the thread.
 * @returns {JSX.Element} The thread component.
 */
function ThreadComponent(props){

  const LoadingStates = {
    LOADING : "Loading",
    LOADED : "Loaded",
    IDLE : "Idle",
  };

  const setDisplay = props.setDisplay;
  const setDisplayDataId = props.setDisplayDataId;

  const [loading, setLoading] = useState(LoadingStates.IDLE);
  const [upToDate, setUpToDate] = useState(false);

  /**
   * Fetches messages from the database.
   * @returns {null} Null.
   */
  const getMessagesFromDB = () =>{
    axios.get(`/threads/${props.id}`, ).then((response) => {
      if (response.status === 200) {
        setLoading(LoadingStates.LOADED);
        setMessages(response.data.messages);
      }
      else {
        console.log(response.message);
      }
    }).catch(err => {
      setLoading(LoadingStates.IDLE);
      console.error(err);
    });
    return null;
  }

  useEffect(() => {
    setLoading(LoadingStates.LOADING);
    getMessagesFromDB()
    setUpToDate(false)}, [upToDate, props.id]);
  

  const [messages, setMessages] = useState(null);
  if(loading === LoadingStates.LOADING || loading === LoadingStates.IDLE){
    return (<label>Loading...</label>);
  }
  return (
  <div className="thread">
    <MessageList messages = {messages} setUpToDate = {setUpToDate} setDisplay = {setDisplay} setDisplayDataId = {setDisplayDataId}/>
    <ThreadMessageForm id = {props.id} setUpToDate = {setUpToDate}/>
  </div>);
}

export default ThreadComponent;
