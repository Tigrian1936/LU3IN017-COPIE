import React from "react";
import GetUrl from "./Url.jsx";
import axios from 'axios';
import {SearchReturnType} from "./SearchReturnType.jsx";
import ThreadList from "./ThreadList.jsx";
import UserList from "./UserList.jsx";
import MessageComponent from "./MessageComponent.jsx";
import MessageList from "./MessageList.jsx";
import {useEffect} from "react";
import {UserContext} from "./UserContext.jsx";
import {useContext} from "react";
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
        return (<div>Loading...</div>);
    }
    if(loading === LoadingStates.IDLE){
        return (<div>Error while loading data</div>);
    }
    return (
        <div>
            <h1>Search Results</h1>
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

export default SearchResults