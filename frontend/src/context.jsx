import {createContext, useReducer} from "react";

let SMContext = createContext();

export default SMContext;

let initialState = {
    access_token:null,
    refresh_token:null,
}
function reducer(state,action)
{   
    switch(action.type)
    {
        case "ADD_TOKENS":{
                // newCopy.push(action[1]);
                return {...action.payload}
        }
        case "ACCESS_TOKEN":{
           
            return {...state,access_token:action.payload}
    }
    default : return state
    }
}


export function SMContextProvider(props)
{
    
    
    let [context,dispatch] = useReducer(reducer,initialState)
    return (
        <SMContext.Provider value={{
            context,
            dispatch
        }}>
            {props.children}
        </SMContext.Provider>
    )
}