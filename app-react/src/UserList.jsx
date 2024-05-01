import ClickableUserProfile from "./ClickableUserProfile.jsx";
import {DisplayTypes} from "./ForumBody.jsx";
import React, { useContext } from 'react';
import { UserContext } from './UserContext';

function UserList(props) {
    const currentUser = useContext(UserContext);
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
            {users.map(user => (
                <ClickableUserProfile key={user.id} user={user} switchToProfile={SwitchToProfile}/>
            ))}
            
        </div>
    );
}

export default UserList;