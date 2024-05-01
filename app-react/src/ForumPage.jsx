import React from 'react';
import { useState, useEffect } from 'react';
import photo from "./assets/react.svg"; 
import AuthentificationPage from './AuthentificationPage';
import ConnectedUserRedirection from './ConnectedUserRedirection';
import { ThreadRecommendation, ThreadsQueryType } from './ThreadRecommendation';
import { ForumBody, DisplayTypes } from './ForumBody';
import { UserContext } from './UserContext';

function ForumPage (props) {
  
  //Current Connected Profile
  const [user, setConnectedUser] = useState(null)

  const logIn = (profile)=>{
    setConnectedUser(profile)
  }

  const logOut = (evt)=>{
    setConnectedUser(null)
  }

  const [currentBodyDisplay,setDisplay] = useState(DisplayTypes.MAINPAGE);
  const [displayDataId, setDisplayDataId] = useState(null);

  const createThreadDisplay = (evt)=>{setDisplay(DisplayTypes.CREATE_THREAD)}

  

  if(user != null){
    return (
      <div className="forum-page">
          <UserContext.Provider value={user}>
              <header>
                  <div id="logo">
                      <img src={photo} alt="logo du site" height="75"/>
                  </div>
                  <div id="search">

                  </div>
                  <div id="connect">
                      <ConnectedUserRedirection logOut={logOut} setDisplay={setDisplay}
                                                setDisplayDataId={setDisplayDataId}/>
                  </div>
              </header>
              <div>
                  <div className="threads-recommandation">
                      <ThreadRecommendation query={ThreadsQueryType.MOSTRECENT} setDisplay={setDisplay}
                                            setDisplayDataId={setDisplayDataId}/>
                      <button onClick={createThreadDisplay}>Create Thread</button>
                  </div>
                  <ForumBody display={currentBodyDisplay} setDisplay={setDisplay}
                             displayDataId={displayDataId} setDisplayDataId={setDisplayDataId}/>
              </div>
          </UserContext.Provider>
      </div>);
  }
    return (<AuthentificationPage logIn={logIn}/>)

}

export default ForumPage;