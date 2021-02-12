import { createStore, combineReducers } from 'redux';

const ActionTypes = {
    SET_USER: 'SET_USER',
}

export const setUserParam = (data) => {
    return {
        type: ActionTypes.SET_USER,
        payload: data,
    }
}

const setUser = (state, action) => {

    var login = action.payload.hasOwnProperty('login') ? action.payload.login : state.login;
    var password = action.payload.hasOwnProperty('password') ? action.payload.password : state.password;
    var token = action.payload.hasOwnProperty('token') ? action.payload.token : state.token;
    
    return {
        ...state,
        login: login,
        password: password,
        token: token,
    }
}

const initialUserData = () => {
    return {
        login: '',
        password: '',
        token: '',
    }
}

const user = (state = initialUserData(), action) => {
    switch(action.type) {
        case ActionTypes.SET_USER:
            return setUser(state, action)
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    user,
})

export default createStore(rootReducer);