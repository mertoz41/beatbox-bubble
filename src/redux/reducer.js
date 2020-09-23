const initialState = {
    loggedInUser: null,
    users: [],
    session: false,
    timeline: [],
    searchedUser: null
}


function reducer(state = initialState, action){
    switch (action.type){
        case "LOG_USER_IN":
            return {...state, loggedInUser: action.loggedInUser };
        case "LOG_USER_OUT":
            return {...state, loggedInUser: null, timeline: []};
        case "ALL_USERS_INCOMING":
            return {...state, users: action.users};
        case "START_MACHINE":
            return {...state, session: true, searchedUser: null};
        case "TIMELINE_INCOMING":
            return {...state, timeline: action.timeline};
        case "BACK_TO_TIMELINE":
            return {...state, session: false, searchedUser: null};
        case "SEARCHED_USER_INCOMING":
            return {...state, searchedUser: action.searchedUser};
        default:
            return state
    }
}


export default reducer