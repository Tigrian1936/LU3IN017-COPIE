import {useState} from 'react';
import axios from 'axios'

function Login(props) {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const getLogin = (evt) => {
        setLogin(evt.target.value)
    }
    const getPassword = (evt) => {
        setPassword(evt.target.value)
    }


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
                    })
                
                } 
            })
            .catch(err => {
                alert(err.response.data.message)
            });
    };

    return (
        <div id='login-page'>
            <label htmlFor="login">Login</label><input id="login" onChange={getLogin}/>
            <label htmlFor="mdp">Mot de passe</label><input type="password" id="mdp" onChange={getPassword}/>
            <button type="submit" onClick={handleSubmit}>Log In</button>
        </div>
    );
}

export default Login;