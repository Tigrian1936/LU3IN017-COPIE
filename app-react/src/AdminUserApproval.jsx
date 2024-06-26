
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import UsersQueryType from "./UsersQueryType.jsx";
import React, { useContext } from 'react';
import { UserContext } from './UserContext';
import UserList from './UserList.jsx';

/**
 * Component for approving users by an admin.
 * @param {Object} props - The component props.
 * @returns {JSX.Element} - The rendered component.
 */
function AdminUserApproval(props) {
    
    /**
     * Enum for loading states.
     * @enum {string}
     */
    const LoadingStates = {
        LOADING: "Loading",
        LOADED: "Loaded",
        IDLE: "Idle",
    };
    
    const user = useContext(UserContext);
    if(!user.is_admin){
        return <div>Not an admin</div>
    }
    
    const [loadingData, setLoadingData] = useState(LoadingStates.IDLE);
    const setDisplay = props.setDisplay;
    const setDisplayDataId = props.setDisplayDataId;

    const [upToDate, setUpToDate] = useState(false);

    /**
     * Fetches non-approved users from the database.
     * @returns {null} - Returns null if the user is not an admin.
     */
    const getNonApprovedUsersFromDB = () => {
        if(!user.is_admin){return null;}
        axios.get(`/users`,{params: { queryType : UsersQueryType.NONAPPROVED}, }).then((response) => {
            if (response.status === 200) {
                console.log(response.data);
                setLoadingData(LoadingStates.LOADED);
                setUsersToApprove(response.data);
            }
            else {
                console.log(response.message);
            }
        }).catch(err => {
            setLoadingData(LoadingStates.IDLE);
            console.error(err);
        });
        return null;
    }

    useEffect(() => {
        setLoadingData(LoadingStates.LOADING);
        getNonApprovedUsersFromDB();
        setUpToDate(false);
    }, [upToDate]);

    const [usersToApprove, setUsersToApprove] = useState(null);
    if(loadingData === LoadingStates.LOADING){
        return <label>Loading...</label>
    }
    if(loadingData === LoadingStates.IDLE){
        return <div>Error while loading data</div>
    }
    return (
        <div className="thread-recommandation-container">
            <label className="forum-body-page-header">Non approved users</label>
            <UserList users={usersToApprove} setDisplay={setDisplay} setDisplayDataId = {setDisplayDataId} setUpToDate = {setUpToDate}/>
        </div>);
}

export default AdminUserApproval;
