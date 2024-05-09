import React from 'react';
import {useContext} from 'react';
import {UserContext} from './UserContext';
import GetUrl from "./Url.jsx";
import axios from 'axios';
function ThreadTitle (props){
  const title = props.title;
  const connectedUser = useContext(UserContext);
  const handleClick = (evt) =>{
     props.switchToThread(props.threadId);
    }
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
      });}
  return (<div className="thread-clickable-title">
     <button type="submit" onClick={handleClick}> {title} </button>
      {connectedUser.is_admin || connectedUser.id === props.original_poster_id ? <button type="submit" onClick={handleDelete}> Delete </button> : null}
  </div>);
}

export default ThreadTitle;