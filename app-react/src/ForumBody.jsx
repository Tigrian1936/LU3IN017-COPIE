import React from 'react';
import ThreadComponent from './ThreadComponent';
import { useState } from 'react';
import UserProfile from './UserProfile';
import ThreadCreation from './ThreadCreation';
import axios from 'axios';
import {ThreadRecommendation, RecommandationQueryType } from './ThreadRecommendation';

const DisplayTypes = {
  MAINPAGE: "MainPage",
  THREAD: "Thread",
  PROFILE: "Profile",
  CREATE_THREAD: "CreateThread",
};
function ForumBody (props) {
  const user = props.user;
  const data_id = props.displayDataId;
  const display = props.display
  const setDisplay = props.setDisplay;
  const setDisplayDataId = props.setDisplayDataId;

  switch(display){
    case DisplayTypes.THREAD: 
      return (<div className="thread-display-page">
        <ThreadComponent user = {user} id={data_id} setDisplay = {setDisplay} setDisplayDataId = {setDisplayDataId}/>
      </div>);
    case DisplayTypes.PROFILE:
      return (<div className="profile-display-page">
        <UserProfile user = {user} id = {data_id} setDisplay = {setDisplay} setDisplayDataId = {setDisplayDataId}/>
      </div>);
    case DisplayTypes.CREATE_THREAD:
      return(<div className = "thread-creation-page">
        <ThreadCreation user = {user} id = {data_id} setDisplay = {setDisplay} setDisplayDataId = {setDisplayDataId}/>
      </div>);
    case DisplayTypes.MAINPAGE: default:
        <ThreadRecommendation user = {user} query = {RecommandationQueryType.MOSTRECENT} setDisplay = {setDisplay} setDisplayDataId = {setDisplayDataId}/>
      break;
  }
}


export {ForumBody, DisplayTypes};