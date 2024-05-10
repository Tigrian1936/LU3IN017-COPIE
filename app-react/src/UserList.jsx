import ClickableUserProfile from "./ClickableUserProfile.jsx";
import { DisplayTypes } from "./ForumBody.jsx";
import React from 'react';

function UserList(props) {
    const users = props.users;
    const setDisplay = props.setDisplay;
    const setDisplayDataId = props.setDisplayDataId;
    const SwitchToProfile = (profile) => {
        setDisplay(DisplayTypes.PROFILE);
        setDisplayDataId(profile.id);
    }
    const ColoredLine = ({ color }) => (
        <hr
            style={{
                color: color,
                backgroundColor: color,
                height: 3
            }}
        />
    );

    return (
        <div>
            {users.map((user, index) => (
                <div>
                    <ClickableUserProfile key={index} user={{ id: user._id, username: user.username, approved: user.approved, is_admin: user.is_admin }} switchToProfile={SwitchToProfile} setUpToDate={props.setUpToDate} />
                    <ColoredLine color={"1A1D1A"}/>
                </div>))}

        </div>
    );
}

            export default UserList;