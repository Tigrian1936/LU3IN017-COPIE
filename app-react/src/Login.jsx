import {useState} from 'react';
import logo from "./assets/react.svg"
import axios from 'axios'
import GetUrl from "./Url.jsx";

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
        axios.post(`${GetUrl()}/authentication/login`, {
            login: login,
            password: password
        }, {headers : {withCredentials: true}})
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
        <div>
            <label htmlFor="login">Login</label><input id="login" onChange={getLogin}/>
            <label htmlFor="mdp">Mot de passe</label><input type="password" id="mdp" onChange={getPassword}/>
            <button type="submit" onClick={handleSubmit}>Log In</button>
            <button type="reset">Cancel</button>
        </div>
    );
}

export default Login;