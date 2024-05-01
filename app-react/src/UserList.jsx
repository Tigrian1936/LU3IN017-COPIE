import ClickableUserProfile from "./ClickableUserProfile.jsx";
import {DisplayTypes} from "./ForumBody.jsx";
import React, { useContext } from 'react';
import { UserContext } from './UserContext';

function UserList(props) {
    const users = props.users;
    const setDisplay = props.setDisplay;
    const setDisplayDataId = props.setDisplayDataId;
    const SwitchToProfile = (profile) => {
        setDisplay(DisplayTypes.PROFILE);
        setDisplayDataId(profile.id);
    }

    return (
        <div>
            <h1>Users</h1>
            {users.map((user, index) => (
                <ClickableUserProfile key={index} user={user} switchToProfile={SwitchToProfile}/>
            ))}
            
        </div>
    );
}

export default UserList;