import ClickableUserProfile from "./ClickableUserProfile.jsx";
import { DisplayTypes } from "./ForumBody.jsx";
import React from 'react';

/**
 * Renders a list of users with clickable user profiles.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.users - The array of user objects.
 * @param {Function} props.setDisplay - The function to set the display type.
 * @param {Function} props.setDisplayDataId - The function to set the display data ID.
 * @param {Function} props.setUpToDate - The function to update the user list.
 * @returns {JSX.Element} The rendered component.
 */
function UserList(props) {
    const users = props.users;
    const setDisplay = props.setDisplay;
    const setDisplayDataId = props.setDisplayDataId;

    /**
     * Switches to the user profile display.
     *
     * @param {Object} profile - The user profile object.
     */
    const SwitchToProfile = (profile) => {
        setDisplay(DisplayTypes.PROFILE);
        setDisplayDataId(profile.id);
    }

    /**
     * Renders a colored line.
     *
     * @param {string} color - The color of the line.
     * @returns {JSX.Element} The rendered line.
     */
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
                <div key={index} >
                    <ClickableUserProfile user={{ id: user._id, username: user.username, approved: user.approved, is_admin: user.is_admin }} switchToProfile={SwitchToProfile} setUpToDate={props.setUpToDate} />
                    <ColoredLine color={"1A1D1A"}/>
                </div>
            ))}
        </div>
    );
}

export default UserList;
