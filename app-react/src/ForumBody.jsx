import React from 'react';
import ThreadComponent from './ThreadComponent';
import { useState } from 'react';
import UserProfile from './UserProfile';
import ThreadCreation from './ThreadCreation';
import axios from 'axios';
import {ThreadRecommendation, ThreadsQueryType } from './ThreadRecommendation';
import AdminUserApproval from './AdminUserApproval';
import SearchResults from "./SearchResults.jsx";
const DisplayTypes = {
  MAIN_PAGE: "MainPage",
  THREAD: "Thread",
  PROFILE: "Profile",
  CREATE_THREAD: "CreateThread",
  ADMIN : "",
  SEARCH: "Search",
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
        <ThreadComponent id={data_id} setDisplay = {setDisplay} setDisplayDataId = {setDisplayDataId}/>
      </div>);
    case DisplayTypes.PROFILE:
      return (<div className="profile-display-page">
        <UserProfile id = {data_id} setDisplay = {setDisplay} setDisplayDataId = {setDisplayDataId}/>
      </div>);
    case DisplayTypes.CREATE_THREAD:
      return(<div className = "thread-creation-page">
        <ThreadCreation id = {data_id} setDisplay = {setDisplay} setDisplayDataId = {setDisplayDataId}/>
      </div>);
    case DisplayTypes.ADMIN:
        return (<div className="admin-page">
            <AdminUserApproval setDisplay = {setDisplay} setDisplayDataId = {setDisplayDataId}/>
        </div>);
    case DisplayTypes.SEARCH:
        return (<div className="search-page">
            <SearchResults query = {data_id} setDisplay = {setDisplay} setDisplayDataId = {setDisplayDataId}/>
        </div>);
    case DisplayTypes.MAIN_PAGE: default:
       return (<ThreadRecommendation query = {ThreadsQueryType.MOSTRECENT} setDisplay = {setDisplay} setDisplayDataId = {setDisplayDataId}/>);
  }
}


export {ForumBody, DisplayTypes};