import React from "react";
import GetUrl from "./Url.jsx";
import axios from 'axios';
import {SearchReturnType} from "./SearchReturnType.jsx";
import {SearchQueryType} from "./SearchQueryType.jsx";
import ThreadList from "./ThreadList.jsx";
import UserList from "./UserList.jsx";
import MessageComponent from "./MessageComponent.jsx";
import MessageList from "./MessageList.jsx";

function SearchResults(props) {
    const [results, setResults] = React.useState([]);
    const setDisplay = props.setDisplay;
    const setDisplayDataId = props.setDisplayDataId;
    const getQueryFromServer = () => {
        axios.get(`${GetUrl()}/search/${props.query}`)
        .then((response) => {
            if(response.status === 200){
                setResults(response.data);
            }
            else{
                console.log(response.message);
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }
    return (
        <div>
            <h1>Search Results</h1>
            <p>Current Query: {props.query}</p>
            {props.query.returnType === SearchReturnType.THREAD?
                <ThreadList threads={results} setDisplay = {setDisplay} setDisplayDataId = {setDisplayDataId}/>
                :null}
            {props.query.returnType === SearchReturnType.USER?
                <UserList users={results} setDisplay = {setDisplay} setDisplayDataId = {setDisplayDataId}/>
                :null}
            {props.query.returnType === SearchReturnType.MESSAGE?
                <MessageList messages={results} setDisplay = {setDisplay} setDisplayDataId = {setDisplayDataId}/>
                :null}
            <button onClick={evt => props.setDisplay("MAIN_PAGE")}>Go back</button>
        </div>
    );  
    
    
    
}

export default SearchResults