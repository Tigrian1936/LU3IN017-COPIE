import React from 'react';
import MessageComponent from './MessageComponent';
import { useState } from 'react';
import { DisplayTypes } from './ForumBody';

function MessageList (props) {

  const setDisplay = props.setDisplay;
  const setDisplayDataId = props.setDisplayDataId;
  const SwitchToProfile = (profile) => {
    setDisplay(DisplayTypes.PROFILE);
    setDisplayDataId(profile.id);
  }

  return (<div className="message-list">
    {props.messages.map((message, index) => (
      <MessageComponent key = {index} user_id = {message.user_id} text = {message.text} date = {message.publish_date} is_admin = {message.is_admin} index = {index} switchToProfile = {SwitchToProfile}/>
    ))}
  </div>);
}


export default MessageList;