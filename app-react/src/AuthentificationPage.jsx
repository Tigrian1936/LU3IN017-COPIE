import { useState } from 'react';
import Signin from "./SignIn"
import Login from './Login';

/**
 * Renders the authentication page.
 * @param {Object} props - The component props.
 * @param {boolean} props.logIn - Indicates whether the user is logged in or not.
 * @returns {JSX.Element} The rendered authentication page.
 */
function AuthentificationPage (props) {
    const [signPage, setSignPage] = useState(false);

    /**
     * Handles the event when the user wants to return to the login page.
     * @param {Event} evt - The event object.
     */
    const returnToLogIn = (evt) => {
        setSignPage(false);
    };
    
    /**
     * Handles the event when the user wants to go to the sign-in page.
     * @param {Event} evt - The event object.
     */
    const goToSignIn = (evt) => {
        setSignPage(true);
    };
    
    if (signPage) {
        return (
            <div>
                <Signin signIn/>
                <button type="submit" onClick={returnToLogIn}> Go back</button>
            </div>
        );
    }
    
    return (
        <div>
            <Login logIn={props.logIn}/>
            <button type="submit" onClick={goToSignIn}> not registered yet? Sign in here</button>
        </div>
    );
}

export default AuthentificationPage;