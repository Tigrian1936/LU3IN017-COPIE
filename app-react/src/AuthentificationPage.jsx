import { useState } from 'react';
import Signin from "./SignIn"
import Login from './Login';

function AuthentificationPage (props) {
    const [signPage, setSignPage] = useState(false);
    const returnToLogIn = (evt)=>{
        setSignPage(false)
    };
    
    const goToSignIn = (evt)=>{
        setSignPage(true)
    };
    
    if(signPage){
        return (
            <div>
                <Signin signIn/>
                <button type="submit" onClick={returnToLogIn}> Go back</button>
            </div>
        );
    }
    return (
        <div>
            <Login logIn =  {props.logIn}/>
            <button type="submit" onClick={goToSignIn}> not registered yet? Sign in here</button>
        </div>
    );

          
}

export default AuthentificationPage;