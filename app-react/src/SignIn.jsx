import { useState } from 'react'
import GetUrl from "./Url.jsx";
import axios from 'axios'
function Signin (props) {
    
    const [passOK, setPassOK] = useState(true);
    const [waitingApproval, setWaitingApproval] = useState(false);
    
    
    const submissionHandler = (evt) => {
        evt.preventDefault();
        const login = document.getElementById("signin_login").value;
        const pass1 = document.getElementById("signin_mdp1").value;
        const pass2 = document.getElementById("signin_mdp2").value;
        if(pass1 === pass2){
            axios.post(`${GetUrl()}/users`, {
                login: login,
                password: pass1
            })
                .then((response) => {
                    if (response.status === 200) {
                        setWaitingApproval(true)
                    } else {
                        console.log(response.message);
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        }
        else{
            setPassOK(false);
        }

    }
    
    if(waitingApproval){
        return (
            <div>
                <p>Waiting for approval</p>
            </div>
        );
    }
    return (
        <div>
            <label htmlFor="signin_login">Login</label><input id="signin_login"/>
            <label htmlFor="signin_mdp1">Password</label><input type="password" id="signin_mdp1"/>
            <label htmlFor="signin_mdp2">Password (2)</label><input type="password" id="signin_mdp2"/>
            <button onClick={submissionHandler}>Sign In0</button>
            <button type="reset">Reset</button>
            {passOK ? <p></p> : <p style={{color: "red"}}>Error: passwordMismatch</p>}
        </div>
    );

}

export default Signin;