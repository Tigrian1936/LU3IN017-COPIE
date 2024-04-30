import React from 'react';
import ClickableUserProfile from './ClickableUserProfile';
import photo from "./assets/react.svg"
function ThreadTitle (props){
  const title = props.title;
  const handleClick = (evt) =>{
     props.switchToThread(props.threadId);
      console.log("Thread clicked");
    }
  return (<div className="thread-clickable-title">
     <button type="submit" onClick={handleClick}> {title} </button>
  </div>);
}

export default ThreadTitle;