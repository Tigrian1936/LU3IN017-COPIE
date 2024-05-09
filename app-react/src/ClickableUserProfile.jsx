import React, {useContext} from 'react';
import {UserContext} from './UserContext';
import GetUrl from "./Url.jsx";
import axios from 'axios';
function ClickableUserProfile(props) {

    const currentUser = useContext(UserContext);

    const ApproveUser = () => {
        axios.post(`${GetUrl()}/users/${props.user.id}`, {withCredentials: true})
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error)
            });
    }
    
    const PromoteUser = () => {
        if(!currentUser.is_admin){return}
        axios.put(`${GetUrl()}/users/${props.user.id}`, {withCredentials: true})
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error)
            });
    }
    
    const DeleteUser = () => {
        axios.delete(`${GetUrl()}/users/${props.user.id}`, {withCredentials: true})
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error)
            });
    }

    return (<div className="messageProfile">
        <div className="message-Profile-details">
            <button className="user-id"
                    onClick={evt => props.switchToProfile(props.user)}>{props.user.username} </button>
            {props.user.id !== -1 && props.user.id !==0 && props.user.id !== currentUser.id && currentUser.is_admin && !props.user.is_admin ? <button
                className="user-id" onClick={DeleteUser}>Delete </button> : null}
            {props.user.id !== -1 && props.user.id !==0 && props.user.id !== currentUser.id && currentUser.is_admin && !props.user.approved ?
                <button className="user-id" onClick={ApproveUser}>Approve</button> : null}
            {props.user.id !== -1 && props.user.id !==0 && props.user.id !== currentUser.id && currentUser.is_admin && props.user.approved && !props.user.is_admin ? <button
                className="user-id" onClick={PromoteUser}>Promote </button> : null}
        </div>
    </div>);
}

export default ClickableUserProfile;