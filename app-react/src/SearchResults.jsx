import React from "react";

import axios from 'axios';
import {SearchReturnType} from "./SearchReturnType.jsx";
import ThreadList from "./ThreadList.jsx";
import UserList from "./UserList.jsx";
import MessageComponent from "./MessageComponent.jsx";
import MessageList from "./MessageList.jsx";
import {useEffect} from "react";
import {UserContext} from "./UserContext.jsx";
import {useContext} from "react";

/**
 * Component that displays the search results based on the provided query.
 * @param {Object} props - The component props.
 * @param {Object} props.query - The search query object.
 * @param {string} props.query.returnType - The type of search results to display (THREAD, USER, MESSAGE).
 * @param {Object} props.query.options - Additional options for the search.
 * @param {Function} props.setDisplay - Function to set the display state in the parent component.
 * @param {Function} props.setDisplayDataId - Function to set the display data ID in the parent component.
 * @returns {JSX.Element} The rendered search results component.
 */
function SearchResults(props) {
    const LoadingStates = {
        LOADING : "Loading",
        LOADED : "Loaded",
        IDLE : "Idle",
    };
    const [results, setResults] = React.useState([]);
    const [loading, setLoading] = React.useState(LoadingStates.IDLE);
    const setDisplay = props.setDisplay;
    const setDisplayDataId = props.setDisplayDataId;
    const connectedUser = useContext(UserContext);

    /**
     * Fetches the search results from the server based on the query.
     */
    const getQueryFromServer = () => {
        axios.get(`/search`, {
            params: {
                returnType: props.query.returnType,
                options: props.query.options
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    setLoading(LoadingStates.LOADED);
                    setResults(response.data);
                } else {
                    alert(response.data.messages) 
                }
            })
            .catch((error) => {
                setLoading(LoadingStates.IDLE);
                alert(error.response.data.messages);
            });
    }

    const [upToDate, setUpToDate] = React.useState(false);
    
    useEffect(() => {
        setLoading(LoadingStates.LOADING)
        getQueryFromServer();
        setUpToDate(false)
    }, [props.query, upToDate]);

    if (loading === LoadingStates.LOADING) {
        return (<label>Loading...</label>);
    }

    if(loading === LoadingStates.IDLE){
        return (<div>Error while loading data</div>);
    }

    return (
        <div>
            <label className="forum-body-page-header">Search Results</label>
            {props.query.returnType === SearchReturnType.THREAD ?
                <ThreadList threads={results} setDisplay={setDisplay} setDisplayDataId={setDisplayDataId} setUpToDate = {setUpToDate}/>
                : null}
            {props.query.returnType === SearchReturnType.USER ?
                <UserList users={results} setDisplay={setDisplay} setDisplayDataId={setDisplayDataId} setUpToDate = {setUpToDate}/>
                : null}
            {props.query.returnType === SearchReturnType.MESSAGE ?
                <MessageList messages={results} setUpToDate = {setUpToDate} setDisplay={setDisplay} setDisplayDataId={setDisplayDataId}/>
                : null}
            <button onClick={evt => props.setDisplay("MAIN_PAGE")}>Go back</button>
        </div>
    );
}

export default SearchResults;
