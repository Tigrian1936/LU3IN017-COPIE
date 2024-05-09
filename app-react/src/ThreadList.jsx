import React from 'react';
import MessageList from './MessageList';
import { useState } from 'react';
import ThreadComponent from './ThreadComponent';
import ThreadTitle from './ThreadTitle';
import { DisplayTypes } from './ForumBody';
function ThreadList (props) {
  const setDisplay = props.setDisplay;
  const setDisplayDataId = props.setDisplayDataId;

  const switchToThread = (threadId) => {
    setDisplay(DisplayTypes.THREAD);
    setDisplayDataId(threadId);
  }
  return (<div className="message-list">
    {props.threads.map((thread, index) => (
      <ThreadTitle key = {index} title = {thread.title} threadId = {thread._id} switchToThread = {switchToThread} setUpToDate = {props.setUpToDate}/>
    ))}
  </div>);
}


export default ThreadList;