

/**
 * Logout component.
 * @param {Object} props - The props object.
 * @param {Function} props.logOut - The logout function.
 * @returns {JSX.Element} The logout button component.
 */
function Logout (props) {
    return (
        <div>
            <button className="button" onClick={event=>props.logOut()}>logout</button>
        </div>
    );
}

export default Logout;