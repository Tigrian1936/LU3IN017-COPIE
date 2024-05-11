import { useState } from 'react'
import ClickableUserProfile from './ClickableUserProfile';
import Logout from './Logout';
import { DisplayTypes } from './ForumBody';
import React, { useContext } from 'react';
import { UserContext } from './UserContext';

/**
 * Component for redirecting a connected user.
 * @param {Object} props - The component props.
 * @param {Function} props.setDisplay - The function to set the display type.
 * @param {Function} props.setDisplayDataId - The function to set the display data ID.
 * @param {Function} props.logOut - The function to log out the user.
 * @returns {JSX.Element} The JSX element representing the connected user redirection component.
 */
function ConnectedUserRedirection (props) {

    /**
     * Switches the display to the user's profile.
     * @param {Object} profile - The user's profile.
     */
    const SwitchToProfile = (profile) => {
        setDisplay(DisplayTypes.PROFILE);
        setDisplayDataId(profile.id);
    }

    const user = useContext(UserContext);
    const setDisplay = props.setDisplay;
    const setDisplayDataId = props.setDisplayDataId;
    return (
        <div>
            <ClickableUserProfile user={user} switchToProfile={SwitchToProfile}/>
            {user.is_admin ? <button onClick={evt => setDisplay(DisplayTypes.ADMIN)}>Admin</button> : null}
            <Logout logOut={props.logOut}/>
        </div>
    );
}

export default ConnectedUserRedirection;