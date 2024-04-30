import { useState } from 'react'
import ClickableUserProfile from './ClickableUserProfile';
import Logout from './Logout';
import { DisplayTypes } from './ForumBody';

function ConnectedUserRedirection (props) {

    const SwitchToProfile = (profile) => {
        setDisplay(DisplayTypes.PROFILE);
        setDisplayDataId(profile.id);
      }
    const setDisplay = props.setDisplay;
    const setDisplayDataId = props.setDisplayDataId;
    return (
        <div>
            <ClickableUserProfile user = {props.user} switchToProfile  = {SwitchToProfile}/>
            <Logout logOut = {props.logOut}/>
        </div>
    );
}

export default ConnectedUserRedirection;