import React from 'react';
import ThreadList from './ThreadList';
import axios from 'axios';

import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { UserContext } from './UserContext';
import { DisplayTypes } from './ForumBody';

/**
 * Enum representing the types of thread queries.
 * @enum {string}
 */
const ThreadsQueryType = {
    MOSTRECENT: "By-most-recent",
};

/**
 * Component for displaying recommended threads.
 * @param {Object} props - The component props.
 * @param {string} props.query - The query type for fetching recommendations.
 * @param {function} props.setDisplay - The function to set the display type.
 * @param {function} props.setDisplayDataId - The function to set the display data ID.
 * @returns {JSX.Element} The JSX element representing the ThreadRecommendation component.
 */
function ThreadRecommendation(props) {

    /**
     * Enum representing the loading states of the component.
     * @enum {string}
     */
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
    const connectedUser = useContext(UserContext);

    /**
     * Function to set the display type to create a new thread.
     * @param {Event} evt - The event object.
     */
    const createThreadDisplay = (evt) => { 
        setDisplay(DisplayTypes.CREATE_THREAD);
        console.log("Test");
    }

    const [upToDate, setUpToDate] = useState(false);

    /**
     * Function to fetch recommendations from the database.
     * @returns {null}
     */
    const getRecommendationsFromDB = () => {
        axios.get(`/threads`,{params: {queryType : queryType, count : displayCount}, }).then((response) => {
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
        setUpToDate(false);
        props.setUpToDate(false)
    }, [queryType, displayCount, upToDate, props.upToDate]);
 
    const [recommendations, setRecommendations] = useState(null);

    if(loadingData === LoadingStates.LOADING || loadingData === LoadingStates.IDLE){
        return <label>Loading...</label>
    }

    return (
        <div className="thread-recommandation-container">
            <ThreadList threads={recommendations} setDisplay={setDisplay} setDisplayDataId = {setDisplayDataId} setUpToDate = {setUpToDate}/>
            <button className='button-create' onClick={createThreadDisplay}>Create Thread</button>
        </div>
    );
}

export {ThreadRecommendation, ThreadsQueryType};
