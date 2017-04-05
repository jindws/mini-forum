import {combineReducers} from 'redux'
import * as actions from './actions.jsx'


const setTitle = (state = [], action) => {
    switch (action.type) {
        case actions.Title:
            return action.title || {};
        default:
            return state;
    }
}

exports.todoApp = combineReducers({setTitle})
