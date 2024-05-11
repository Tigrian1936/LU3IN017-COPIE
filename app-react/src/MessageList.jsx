import React from 'react';
import MessageComponent from './MessageComponent';
import { useState } from 'react';
import { DisplayTypes } from './ForumBody';

/**
 * Renders a list of messages.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.messages - The array of messages to display.
 * @param {Function} props.setDisplay - The function to set the display type.
 * @param {Function} props.setDisplayDataId - The function to set the display data ID.
 * @param {Function} props.setUpToDate - The function to update the message list.
 * @returns {JSX.Element} The rendered component.
 */
function MessageList (props) {
  const setDisplay = props.setDisplay;
  const setDisplayDataId = props.setDisplayDataId;

  /**
   * Switches to the profile display.
   *
   * @param {Object} profile - The profile object.
   */
  const SwitchToProfile = (profile) => {
    setDisplay(DisplayTypes.PROFILE);
    setDisplayDataId(profile.id);
  }
  
  return (
    <div className="message-list">
      {props.messages.map((message, index) => (
        <MessageComponent
          key={index}
          id={message._id}
          setUpToDate={props.setUpToDate}
          user_id={message.user_id}
          text={message.text}
          date={message.publish_date}
          is_admin={message.is_admin}
          index={index}
          switchToProfile={SwitchToProfile}
        />
      ))}
    </div>
  );
}

export default MessageList;