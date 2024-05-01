import React from 'react';
import ThreadList from './ThreadList';
import axios from 'axios';
import GetUrl from './Url';
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { UserContext } from './UserContext';
const ThreadsQueryType = {
    MOSTRECENT: "By-most-recent",
};

function ThreadRecommendation(props) {

    const LoadingStates = {
        LOADING: "Loading",
        LOADED: "Loaded",
        IDLE: "Idle",
    };

    const [loadingData, setLoadingData] = useState(LoadingStates.IDLE);
    const [queryType, setQueryType] = useState(props.query)
    const [displayCount, setDisplayCount] = useState(50)
    const setDisplay = props.setDisplay;
    const setDisplayDataId = props.setDisplayDataId;


    const getRecommendationsFromDB = () => {
        axios.get(`${GetUrl()}/threads`,{params: {queryType : queryType, count : displayCount}}).then((response) => {
            if (response.status === 200) {
                setLoadingData(LoadingStates.LOADED);  
                setRecommendations(response.data);
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
        getRecommendationsFromDB();
    }, [queryType, displayCount]);
 
    const [recommendations, setRecommendations] = useState(null);
    if(loadingData === LoadingStates.LOADING || loadingData === LoadingStates.IDLE){
        return <div>Loading...</div>
    }
    return (
        <div className="thread-recommandation-container">
            <ThreadList threads={recommendations} setDisplay={setDisplay} setDisplayDataId = {setDisplayDataId}/>
        </div>);
}

export {ThreadRecommendation, ThreadsQueryType};
