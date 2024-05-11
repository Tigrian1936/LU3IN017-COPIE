import React from 'react';
import ThreadComponent from './ThreadComponent';
import { useState } from 'react';
import UserProfile from './UserProfile';
import ThreadCreation from './ThreadCreation';
import axios from 'axios';
import {ThreadRecommendation, ThreadsQueryType } from './ThreadRecommendation';
import AdminUserApproval from './AdminUserApproval';
import SearchResults from "./SearchResults.jsx";

/**
 * Enum representing the different display types in the forum body.
 * @enum {string}
 */
const DisplayTypes = {
  MAIN_PAGE: "MainPage",
  THREAD: "Thread",
  PROFILE: "Profile",
  CREATE_THREAD: "CreateThread",
  ADMIN : "",
  SEARCH: "Search",
};

/**
 * Component representing the main body of the forum.
 * @param {Object} props - The component props.
 * @param {Object} props.user - The user object.
 * @param {string} props.displayDataId - The ID of the data to be displayed.
 * @param {string} props.display - The current display type.
 * @param {Function} props.setDisplay - The function to set the display type.
 * @param {Function} props.setDisplayDataId - The function to set the data ID to be displayed.
 * @param {boolean} props.upToDate - Indicates if the thread recommendation is up to date.
 * @param {Function} props.setUpToDate - The function to set the upToDate flag.
 * @returns {JSX.Element} The rendered ForumBody component.
 */
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
      return(<div className="thread-creation-page">
        <ThreadCreation id = {data_id} setDisplay = {setDisplay} setDisplayDataId = {setDisplayDataId} setUpToDate = {props.setUpToDate}/>
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
       return (<ThreadRecommendation query = {ThreadsQueryType.MOSTRECENT} setDisplay = {setDisplay} setDisplayDataId = {setDisplayDataId} upToDate = {props.upToDate} setUpToDate = {props.setUpToDate}/>);
  }
}

export {ForumBody, DisplayTypes};