import GetUrl from "./Url.jsx";
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import UsersQueryType from "./UsersQueryType.jsx";
import React, { useContext } from 'react';
import { UserContext } from './UserContext';
import UserList from './UserList.jsx';
function AdminUserApproval(props) {
    
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


    const getNonApprovedUsersFromDB = () => {
        if(!user.is_admin){return null;}
        axios.get(`${GetUrl()}/users`,{withCredentials: true, params: { queryType : UsersQueryType.NONAPPROVED}}).then((response) => {
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
    }, []);

    const [usersToApprove, setUsersToApprove] = useState(null);
    if(loadingData === LoadingStates.LOADING){
        return <div>Loading...</div>
    }
    if(loadingData === LoadingStates.IDLE){
        return <div>Error while loading data</div>
    }
    return (
        <div className="thread-recommandation-container">
            <UserList users={usersToApprove} setDisplay={setDisplay} setDisplayDataId = {setDisplayDataId}/>
        </div>);
}

export default AdminUserApproval;
