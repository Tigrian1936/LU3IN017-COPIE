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

  const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 3
        }}
    />
  );

  return (<div className="message-list">
    {props.threads.map((thread, index) => (
      <div>
        <ThreadTitle key = {index} title = {thread.title} threadId = {thread._id} switchToThread = {switchToThread} setUpToDate = {props.setUpToDate}/>
        <ColoredLine color={"03120E"}/>
      </div>))}
  </div>);
}


export default ThreadList;