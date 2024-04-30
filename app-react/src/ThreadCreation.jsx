import React from 'react';
import GetUrl from './Url';
import axios from 'axios';
import { DisplayTypes } from './ForumBody';
function ThreadCreation(props){
  const createThread = ()=> {
    axios.post(`${GetUrl()}/threads`, {
            original_poster_id: props.user.id,
            title: document.getElementById("title").value, 
            is_admin: props.user.is_admin && document.getElementById("admin").checked
        })
        .then((response) =>{
            if(response.status === 200)
            {
              props.setDisplay(DisplayTypes.THREAD)   
              console.log(response.data.thread_id);
              props.setDisplayDataId(response.data.thread_id)
            }
            else{
                console.log(response.message);
            }
        })
        .catch(err => {
            console.error(err);
        });
  }
  if(props.user.is_admin){
    return (<div className="thread-creation-fields">
    <label>Titre</label><input id="title"/>
    <toggle>Admin</toggle>
    <button onClick={createThread}> Create</button>      
  </div>);
  }
  else{
    return (<div className="thread-creation-fields">
    <label>Titre</label><input id="title"/>
    <button onClick={createThread}> Create</button>      
  </div>);
  }
  
}

export default ThreadCreation;
