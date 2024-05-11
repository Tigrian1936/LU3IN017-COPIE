import React from 'react';
import { useState } from 'react';
import axios from 'axios';

import { useContext } from 'react';
import { UserContext } from './UserContext';

/**
 * A form component for creating new thread messages.
 *
 * @param {Object} props - The component props.
 * @param {string} props.id - The ID of the thread.
 * @param {function} props.setUpToDate - A function to update the thread state.
 * @returns {JSX.Element} The ThreadMessageForm component.
 */
function ThreadMessageForm(props) {
    const [message, setMessage] = useState('');
    const user = useContext(UserContext);

    /**
     * Handles the submission of a new message.
     *
     * @param {Event} event - The form submission event.
     */
    const handeSubmitNewMessage = (event) => {
        event.preventDefault();
        axios
            .post(`/threads/${props.id}`, {
                user_id: user.id,
                text: message,
            })
            .then((response) => {
                if (response.status === 200) {
                    props.setUpToDate(true);
                } else {
                    console.log(response.message);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <div>
            <label htmlFor="new-message-label">Nouveau Message</label>
            <input
                id="new-message"
                value={message}
                onChange={(evt) => setMessage(evt.target.value)}
            />
            <button
                className="button-create"
                type="submit"
                name="publish-button"
                onClick={handeSubmitNewMessage}
            >
                Publier
            </button>
        </div>
    );
}

export default ThreadMessageForm;