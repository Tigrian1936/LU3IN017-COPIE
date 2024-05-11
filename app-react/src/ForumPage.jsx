import React from 'react';
import { useState, useEffect } from 'react';
import photo from "./assets/image0.jpeg";
import AuthentificationPage from './AuthentificationPage';
import ConnectedUserRedirection from './ConnectedUserRedirection';
import { ThreadRecommendation, ThreadsQueryType } from './ThreadRecommendation';
import { ForumBody, DisplayTypes } from './ForumBody';
import { UserContext } from './UserContext';
import Search from './Search';
import axios from 'axios';

/**
 * Forum page component.
 * @param {object} props - The component props.
 * @returns {JSX.Element} - The rendered component.
 */
function ForumPage(props) {

  // Current Connected Profile
  const [user, setConnectedUser] = useState(null)

  /**
   * Log in the user.
   * @param {object} profile - The user profile.
   */
  const logIn = (profile) => {
    setConnectedUser(profile)
  }

  /**
   * Log out the user.
   * @param {Event} evt - The event object.
   */
  const logOut = (evt) => {
    axios.get(`/authentication/logout`,)
      .then((response) => {
        if (response.status === 200) {
          setConnectedUser(null);
          setDisplay(DisplayTypes.MAIN_PAGE);
        }
      }).catch((err) => {
        alert(err.response.data.message)
      });
  }

  const [currentBodyDisplay, setDisplay] = useState(DisplayTypes.MAIN_PAGE);
  const [displayDataId, setDisplayDataId] = useState(null);
  const [upToDate, setUpToDate] = useState(false);

  axios.defaults.baseURL = "http://localhost:5000";
  axios.defaults.withCredentials = true;

  if (user != null) {
    return (
      <div className="forum-page">
        <UserContext.Provider value={user}>
          <header>
            <div id="logo">
              <img src={photo} alt="logo du site" height="150" />
              <div id='forum-title-container'>
                <label id='forum-title'>SUPER FORUM</label>
              </div>
            </div>
            <div id="search">
              <Search setDisplay={setDisplay} setDisplayDataId={setDisplayDataId} />
            </div>
            <div id="connect">
              <ConnectedUserRedirection logOut={logOut} setDisplay={setDisplay}
                setDisplayDataId={setDisplayDataId} />
            </div>
          </header>
          <div id="forum-lower-part">
            <div id="threads-recommendation">
              <div id="thread-recommendation-border">
                <ThreadRecommendation query={ThreadsQueryType.MOSTRECENT} setDisplay={setDisplay}
                  setDisplayDataId={setDisplayDataId} upToDate={upToDate} setUpToDate={setUpToDate} />
              </div>
            </div>
            <div id="forum-body">
              <ForumBody display={currentBodyDisplay} setDisplay={setDisplay}
                displayDataId={displayDataId} setDisplayDataId={setDisplayDataId} upToDate={upToDate} setUpToDate={setUpToDate} />
            </div>
          </div>
        </UserContext.Provider>
      </div>);
  }
  return (<AuthentificationPage logIn={logIn} />)

}

export default ForumPage;