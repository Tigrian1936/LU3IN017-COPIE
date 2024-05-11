import { useState } from 'react';
import axios from 'axios';

/**
 * Login component for user authentication.
 * @param {Object} props - The component props.
 * @param {Function} props.logIn - The function to call when the user successfully logs in.
 * @returns {JSX.Element} The rendered Login component.
 */
function Login(props) {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    /**
     * Updates the login state with the input value.
     * @param {Object} evt - The input event object.
     */
    const getLogin = (evt) => {
        setLogin(evt.target.value);
    };

    /**
     * Updates the password state with the input value.
     * @param {Object} evt - The input event object.
     */
    const getPassword = (evt) => {
        setPassword(evt.target.value);
    };

    /**
     * Handles the form submission and performs the login request.
     */
    const handleSubmit = () => {
        axios.post(`/authentication/login`, {
            login: login,
            password: password
        })
            .then((response) => {
                if (response.status === 200) {
                    props.logIn({
                        id: response.data._id,
                        username: login,
                        register_Date: response.data.register_Date,
                        is_admin: response.data.is_admin
                    });
                }
            })
            .catch(err => {
                alert(err.response.data.message);
            });
    };

    return (
        <div id='login-page'>
            <label htmlFor="login">Login</label><input id="login" onChange={getLogin} />
            <label htmlFor="mdp">Mot de passe</label><input type="password" id="mdp" onChange={getPassword} />
            <button type="submit" onClick={handleSubmit}>Log In</button>
        </div>
    );
}

export default Login;