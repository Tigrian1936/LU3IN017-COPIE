import React from 'react';
const SearchReturnType = {
    THREAD: 0,
    USER: 1,
    MESSAGE: 2,
};

const SearchQueryType = {
    TEXT: 0,
    DATE: 1
}
function Search(props) {
    const [returnType, setReturnType] = React.useState(SearchReturnType.THREAD);
    const [options, setOptions] = React.useState([]);

    const addQuery = () => {
        setOptions([...options, {by :SearchReturnType.THREAD,  type: SearchQueryType.TEXT, value: "" }]);
    }

    return (
        <div>
            <div>
                <select onChange={evt => setReturnType(evt.value)}>
                    <option value={SearchReturnType.THREAD}>Thread</option>
                    <option value={SearchReturnType.USER}>User</option>
                    <option value={SearchReturnType.MESSAGE}>Message</option>
                </select>
                <button onClick={addQuery}>Add query</button>
                <div>
                    {options.map((option, index) => {
                        return (
                            <div key={index}>
                                <select onChange={evt => setOptions([...options.slice(0, index), { by : evt.value, type: option.type, value: null}, ...options.slice(index + 1, options.length)])}>
                                    <option value={SearchReturnType.MESSAGE}>Message</option>
                                    <option value={SearchReturnType.THREAD}>Thread</option>
                                    <option value={SearchReturnType.USER}>User</option>
                                </select>
                                <select onChange={evt => setOptions([...options.slice(0, index), {by : option.by, type: evt.value, value: null}, ...options.slice(index + 1, options.length)])}>
                                    <option value={SearchQueryType.TEXT}>Text</option>
                                    <option value={SearchQueryType.DATE}>Date</option>
                                </select>
                                <input type={options[index].type === SearchQueryType.DATE ? 'date':'text'} onChange={evt => setOptions([...options.slice(0, index), { type: options[index].value , value: evt.value}, ...options.slice(index + 1, options.length)])}></input>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Search