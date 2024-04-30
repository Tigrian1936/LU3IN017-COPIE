import React from 'react';

function ClickableUserProfile (props){

  return (<div className="messageProfile">
    <div className="message-Profile-details">
        <button className="user-id" onClick={evt => props.switchToProfile(props.user)}>{props.user.username} </button> 
    </div>  
  </div>);
}

export default ClickableUserProfile;