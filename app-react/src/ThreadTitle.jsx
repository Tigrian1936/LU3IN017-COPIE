import React from 'react';
import {useContext} from 'react';
import {UserContext} from './UserContext';

import axios from 'axios';

/**
 * Component representing a clickable thread with its title as display.
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the thread.
 * @param {number} props.threadId - The ID of the thread.
 * @param {number} props.original_poster_id - The ID of the original poster of the thread.
 * @param {function} props.switchToThread - Function to switch to a different thread.
 * @param {function} props.setUpToDate - Function to set the thread up-to-date.
 * @returns {JSX.Element} The rendered ThreadTitle component.
 */
function ThreadTitle (props){
  const title = props.title;
  const connectedUser = useContext(UserContext);

  /**
   * Handles the click event when the thread title is clicked.
   * @param {Object} evt - The click event object.
   */
  const handleClick = (evt) =>{
     props.switchToThread(props.threadId);
  }

  /**
   * Handles the click event when the delete button is clicked.
   * @param {Object} evt - The click event object.
   */
  const handleDelete = (evt) =>{
    axios.delete(`/threads/${props.threadId}`, ).then((response) => {
      if(response.status === 200){
        props.setUpToDate(true);
      }
      else{
        console.log(response.message);
      }
    }).catch(err => {
      console.error(err);
    });
  }

  return (
    <div className="thread-clickable-title">
      <button type="submit" onClick={handleClick}> {title} </button>
      {connectedUser.is_admin || connectedUser.id === props.original_poster_id ? <button type="submit" onClick={handleDelete}> Delete </button> : null}
    </div>
  );
}

export default ThreadTitle;