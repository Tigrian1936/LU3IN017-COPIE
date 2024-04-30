import AuthentificationPage from "./AuthentificationPage";


function Logout (props) {
    return (
        <div>
            <button className="button" onClick={event=>props.logOut()}>logout</button>
        </div>
    );
}

export default Logout;