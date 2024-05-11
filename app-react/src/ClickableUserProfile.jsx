import React, {useContext} from 'react';
import {UserContext} from './UserContext';

import axios from 'axios';

/**
 * Component representing a clickable user profile.
 * @param {Object} props - The component props.
 * @param {Object} props.user - The user object.
 * @param {Function} props.switchToProfile - Function to switch to user profile.
 * @param {Function} props.setUpToDate - Function to update user data.
 * @returns {JSX.Element} - The rendered component.
 */
function ClickableUserProfile(props) {

    const currentUser = useContext(UserContext);
    
    /**
     * Approves the user if the current user is an admin.
     */
    const ApproveUser = () => {
        if(!currentUser.is_admin){return}
        axios.patch(`/users/${props.user.id}`, {field : "approved", value : true, })
            .then((response) => {
                if(response.status === 200)props.setUpToDate(true);
            })
            .catch((error) => {
                console.log(error)
            });
    }
    
    /**
     * Promotes the user to admin if the current user is an admin.
     */
    const PromoteUser = () => {
        if(!currentUser.is_admin){return}
        axios.patch(`/users/${props.user.id}`, {field : "is_admin", value : true})
            .then((response) => {
                props.setUpToDate(true);
            })
            .catch((error) => {
                console.log(error)
            });
    }
    
    /**
     * Deletes the user if the current user is an admin.
     */
    const DeleteUser = () => {
        if(!currentUser.is_admin){return}
        axios.delete(`/users/${props.user.id}`)
            .then((response) => {
                if(response.status === 200) props.setUpToDate(true);
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