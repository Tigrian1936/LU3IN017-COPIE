import React from 'react';
import { useState, useEffect } from 'react';
import photo from "./assets/react.svg"; 
import AuthentificationPage from './AuthentificationPage';
import ConnectedUserRedirection from './ConnectedUserRedirection';
import { ThreadRecommendation, RecommandationQueryType } from './ThreadRecommendation';
import { ForumBody, DisplayTypes } from './ForumBody';


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
         <header>
          <div id="logo">
              <img src={photo} alt = "logo du site" height="75"/>
          </div>
          <div id="search">
            
          </div>
          <div id="connect">
              <ConnectedUserRedirection logOut = {logOut} setDisplay = {setDisplay} setDisplayDataId = {setDisplayDataId} user = {user}/>
          </div>
         </header>
         <div>
          <div className="threads-recommandation">  
            <ThreadRecommendation user={user} query={RecommandationQueryType.MOSTRECENT} setDisplay = {setDisplay} setDisplayDataId = {setDisplayDataId}/>
            <button onClick={createThreadDisplay}>Create Thread</button>
          </div>
          <ForumBody user = {user} display = {currentBodyDisplay} setDisplay = {setDisplay} displayDataId = {displayDataId} setDisplayDataId = {setDisplayDataId}/>
        </div>
      </div>);
  }
  return(<AuthentificationPage logIn = {logIn}/>)

}

export default ForumPage;