import { useState } from 'react'
import ClickableUserProfile from './ClickableUserProfile';
import Logout from './Logout';
import { DisplayTypes } from './ForumBody';
import React, { useContext } from 'react';
import { UserContext } from './UserContext';
function ConnectedUserRedirection (props) {

    const SwitchToProfile = (profile) => {
        setDisplay(DisplayTypes.PROFILE);
        setDisplayDataId(profile.id);
      }

    const user = useContext(UserContext);
    const setDisplay = props.setDisplay;
    const setDisplayDataId = props.setDisplayDataId;
    return (
        <div>
            <ClickableUserProfile user = {user} switchToProfile  = {SwitchToProfile}/>
            {user.is_admin ? <button onClick={evt => setDisplay(DisplayTypes.ADMIN)}>Admin</button> : null}
            <Logout logOut = {props.logOut}/>
        </div>
    );
}

export default ConnectedUserRedirection;