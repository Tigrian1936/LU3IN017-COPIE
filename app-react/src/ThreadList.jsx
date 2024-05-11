import React from 'react';
import MessageList from './MessageList';
import { useState } from 'react';
import ThreadComponent from './ThreadComponent';
import ThreadTitle from './ThreadTitle';
import { DisplayTypes } from './ForumBody';

/**
 * Renders a list of threads.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.threads - The array of threads to render.
 * @param {Function} props.setDisplay - The function to set the display type.
 * @param {Function} props.setDisplayDataId - The function to set the display data ID.
 * @param {Function} props.setUpToDate - The function to set the thread up-to-date status.
 * @returns {JSX.Element} The rendered ThreadList component.
 */
function ThreadList (props) {
  const setDisplay = props.setDisplay;
  const setDisplayDataId = props.setDisplayDataId;

  /**
   * Switches to a specific thread.
   *
   * @param {string} threadId - The ID of the thread to switch to.
   */
  const switchToThread = (threadId) => {
    setDisplay(DisplayTypes.THREAD);
    setDisplayDataId(threadId);
  }

  /**
   * Renders a colored line.
   *
   * @param {string} color - The color of the line.
   * @returns {JSX.Element} The rendered colored line.
   */
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
      <div key = {index}>
        <ThreadTitle title = {thread.title} threadId = {thread._id} switchToThread = {switchToThread} setUpToDate = {props.setUpToDate}/>
        <ColoredLine color={"03120E"}/>
      </div>))}
  </div>);
}

export default ThreadList;